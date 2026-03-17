import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const NS = "- - - - Not Supported - - - -";

const GSTR9Summary: React.FC = () => {
    const [filters, setFilters] = useState({ fromDate: "", toDate: "" });

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    /* ─── shared style helpers ─── */
    const thBase =
        "border border-gray-300 px-3 py-2 text-left font-semibold text-[#1A1A1A] text-xs";
    const tdBase = "border border-gray-300 px-3 py-2 text-sm";
    const tdR = `${tdBase} text-right`;
    const nsCell = "border border-gray-300 px-3 py-2 text-sm text-gray-400 italic text-center";
    const sectionHeader =
        "bg-[#C72030] text-white font-semibold px-3 py-2 text-sm";
    const subHeader = "bg-[#E5E0D3] font-semibold px-3 py-2 text-sm text-[#1A1A1A]";
    const subtotalRow = "bg-[#E5E0D3] font-semibold";

    return (
        <div
            className="w-full bg-[#f9f7f2] p-6"
            style={{ minHeight: "100vh", boxSizing: "border-box" }}
        >
            {/* ── FILTER CARD ── */}
            <div className="bg-white rounded-lg border-2 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                            GSTR-9 Summary
                        </h3>
                        <p className="text-sm text-gray-500">Annual GST Return Summary</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <TextField
                        label="From Date" type="date" name="fromDate"
                        value={filters.fromDate} onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }} fullWidth size="small"
                    />
                    <TextField
                        label="To Date" type="date" name="toDate"
                        value={filters.toDate} onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }} fullWidth size="small"
                    />
                    <Button className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]">
                        View
                    </Button>
                </div>
            </div>

            {/* ── NOTES ── */}
            <div className="bg-white rounded-lg border p-4 mb-6 text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-[#1A1A1A] mb-2">Please Note:</p>
                <p>1. This return is generated based on the transactions available in Zoho Books only.</p>
                <p>2. Regenerate the return in case you update any transactions that fall under the return filing period.</p>
            </div>

            {/* ── Pt. I Basic Details ── */}
            <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
                <div className={`${sectionHeader} rounded-t-lg`}>Pt. I &nbsp; Basic Details</div>
                <table className="w-full border-collapse text-sm">
                    <tbody>
                        <tr>
                            <td className={`${tdBase} w-8 font-semibold`}>1.</td>
                            <td className={tdBase}>Financial Year</td>
                            <td className={tdBase}>2026-2026</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>2.</td>
                            <td className={tdBase}>GSTIN</td>
                            <td className={tdBase}>27AGOPL6958QABC</td>
                        </tr>
                        <tr>
                            <td className={`${tdBase} font-semibold`}>3.</td>
                            <td className={tdBase}>Trade Name (if any)</td>
                            <td className={tdBase}>Lockated</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ── Pt. II Outward & Inward Supplies ── */}
            <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
                <div className={`${sectionHeader} rounded-t-lg`}>
                    Pt. II &nbsp; Details of Outward and Inward supplies declared during the financial year
                </div>
                <p className="text-xs text-gray-500 px-3 py-1">(Amount in ₹ in all tables)</p>

                {/* Column header row */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={`${thBase} w-8`}></th>
                            <th className={thBase}>Nature of Supplies</th>
                            <th className={`${thBase} text-right`}>Taxable Value</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                        </tr>
                        <tr className="bg-[#E5E0D3]">
                            {["1", "2", "3", "4", "5", "6", ""].map((n, i) => (
                                <th key={i} className={`${thBase} text-center`}>{n}</th>
                            ))}
                        </tr>
                    </thead>
                </table>

                {/* Section 4 */}
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className={`${subHeader} w-8`} colSpan={7}>
                                4 &nbsp; Details of advances, inward and outward supplies on which tax is payable as declared in returns filed during the financial year
                            </td>
                        </tr>

                        {[
                            { key: "A", label: "Supplies made to un-registered persons (B2C)", tv: "₹0.00", ct: "₹0.00", st: "₹0.00", it: "₹0.00", cess: "₹0.00" },
                            { key: "B", label: "Supplies made to registered persons (B2B)", tv: "₹1,380.00", ct: "₹34.50", st: "₹34.50", it: "₹0.00", cess: "₹0.00" },
                            { key: "C", label: "Zero rated supply (Export) on payment of tax (except supplies to SEZs)", tv: "₹0.00", ct: "", st: "", it: "₹0.00", cess: "₹0.00" },
                            { key: "D", label: "Supply to SEZs on payment of tax", tv: "₹0.00", ct: "", st: "", it: "₹0.00", cess: "₹0.00" },
                        ].map((r, i) => (
                            <tr key={r.key} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                                <td className={`${tdBase} w-8 font-semibold`}>{r.key}</td>
                                <td className={tdBase}>{r.label}</td>
                                <td className={tdR}>{r.tv}</td>
                                <td className={tdR}>{r.ct}</td>
                                <td className={tdR}>{r.st}</td>
                                <td className={tdR}>{r.it}</td>
                                <td className={tdR}>{r.cess}</td>
                            </tr>
                        ))}

                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>E</td>
                            <td className={tdBase}>Deemed Exports</td>
                            <td className={nsCell} colSpan={5}>{NS}</td>
                        </tr>

                        <tr>
                            <td className={`${tdBase} font-semibold`}>F</td>
                            <td className={tdBase}>Advances on which tax has been paid but invoice has not been issued (not covered under (A) to (E) above)</td>
                            <td className={tdR}>₹81.30</td>
                            <td className={tdR}>₹11.38</td>
                            <td className={tdR}>₹7.32</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>G</td>
                            <td className={tdBase}>Inward supplies on which tax is to be paid on reverse charge basis</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        <tr className={subtotalRow}>
                            <td className={`${tdBase} font-semibold`}>H</td>
                            <td className={tdBase}>Sub-total (A to G above)</td>
                            <td className={tdR}>₹1,461.30</td>
                            <td className={tdR}>₹45.88</td>
                            <td className={tdR}>₹41.82</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        <tr>
                            <td className={`${tdBase} font-semibold`}>I</td>
                            <td className={tdBase}>Credit Notes issued in respect of transactions specified in (B) to (E) above (-)</td>
                            <td className={tdR}>₹500.00</td>
                            <td className={tdR}>₹12.50</td>
                            <td className={tdR}>₹12.50</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>J</td>
                            <td className={tdBase}>Debit Notes issued in respect of transactions specified in (B) to (E) above (+)</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        {["K - Supplies / tax declared through Amendments (+)", "L - Supplies / tax reduced through Amendments (-)"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{label.split(" - ")[0]}</td>
                                <td className={tdBase}>{label.split(" - ")[1]}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}

                        <tr className={subtotalRow}>
                            <td className={`${tdBase} font-semibold`}>M</td>
                            <td className={tdBase}>Sub-total (I to L above)</td>
                            <td className={tdR}>₹-500.00</td>
                            <td className={tdR}>₹-12.50</td>
                            <td className={tdR}>₹-12.50</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        <tr className={subtotalRow}>
                            <td className={`${tdBase} font-semibold`}>N</td>
                            <td className={tdBase}>Supplies and advances on which tax is to be paid (H + M) above</td>
                            <td className={tdR}>₹961.30</td>
                            <td className={tdR}>₹33.38</td>
                            <td className={tdR}>₹29.32</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>

                        {/* Section 5 */}
                        <tr>
                            <td className={subHeader} colSpan={7}>
                                5 &nbsp; Details of Outward supplies on which tax is not payable as declared in returns filed during the financial year
                            </td>
                        </tr>

                        {[
                            { key: "A", label: "Zero rated supply (Export) without payment of tax", tv: "₹0.00", rest: false },
                            { key: "B", label: "Supply to SEZs without payment of tax", tv: "₹0.00", rest: false },
                            { key: "C", label: "Supplies on which tax is to be paid by the recipient on reverse charge basis", tv: "₹0.00", ct: "₹0.00", st: "₹0.00", it: "₹0.00", cess: "₹0.00", rest: true },
                            { key: "D", label: "Exempted", tv: "₹0.00", rest: false },
                            { key: "E", label: "Nil Rated", tv: "₹0.00", rest: false },
                            { key: "F", label: "Non-GST supply", tv: "₹0.00", rest: false },
                        ].map((r, i) => (
                            <tr key={r.key} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{r.key}</td>
                                <td className={tdBase}>{r.label}</td>
                                <td className={tdR}>{r.tv}</td>
                                {r.rest ? (
                                    <>
                                        <td className={tdR}>{(r as any).ct}</td>
                                        <td className={tdR}>{(r as any).st}</td>
                                        <td className={tdR}>{(r as any).it}</td>
                                        <td className={tdR}>{(r as any).cess}</td>
                                    </>
                                ) : (
                                    <td className={tdBase} colSpan={4}></td>
                                )}
                            </tr>
                        ))}

                        <tr className={subtotalRow}>
                            <td className={`${tdBase} font-semibold`}>G</td>
                            <td className={tdBase}>Sub-total (A to F above)</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>

                        {[
                            { key: "H", label: "Credit Notes issued in respect of transactions specified in A to F above (-)", vals: ["₹0.00", "₹0.00", "₹0.00", "₹0.00", "₹0.00"] },
                            { key: "I", label: "Debit Notes issued in respect of transactions specified in A to F above (+)", vals: ["₹0.00", "₹0.00", "₹0.00", "₹0.00", "₹0.00"] },
                        ].map((r, i) => (
                            <tr key={r.key} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{r.key}</td>
                                <td className={tdBase}>{r.label}</td>
                                {r.vals.map((v, j) => <td key={j} className={tdR}>{v}</td>)}
                            </tr>
                        ))}

                        {["J - Supplies / tax declared through Amendments (+)", "K - Supplies / tax reduced through Amendments (-)"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{label.split(" - ")[0]}</td>
                                <td className={tdBase}>{label.split(" - ")[1]}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}

                        {[
                            { key: "L", label: "Sub-Total (H to K above)", vals: ["₹0.00", "₹0.00", "₹0.00", "₹0.00", "₹0.00"], sub: true },
                            { key: "M", label: "Turnover on which tax is not to be paid (G + L above)", vals: ["₹0.00", "₹0.00", "₹0.00", "₹0.00", "₹0.00"], sub: true },
                            { key: "N", label: "Total Turnover (including advances) (4N + 5M - 4G above)", vals: ["₹961.30", "₹33.38", "₹29.32", "₹0.00", "₹0.00"], sub: true },
                        ].map((r) => (
                            <tr key={r.key} className={subtotalRow}>
                                <td className={`${tdBase} font-semibold`}>{r.key}</td>
                                <td className={tdBase}>{r.label}</td>
                                {r.vals.map((v, j) => <td key={j} className={tdR}>{v}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pt. III ITC ── */}
            <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
                <div className={`${sectionHeader} rounded-t-lg`}>
                    Pt. III &nbsp; Details of ITC as declared in returns filed during the financial year
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={`${thBase} w-8`}></th>
                            <th className={thBase}>Description</th>
                            <th className={thBase}>Type</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                        </tr>
                        <tr className="bg-[#E5E0D3]">
                            {["1", "2", "3", "4", "5", "6", ""].map((n, i) => (
                                <th key={i} className={`${thBase} text-center`}>{n}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={subHeader} colSpan={7}>
                                6 &nbsp; Details of ITC availed as declared in returns filed during the financial year
                            </td>
                        </tr>

                        {[
                            { key: "A", label: "Total amount of input tax credit availed through FORM GSTR-3B (sum total of Table 4A of FORM GSTR-3B)", ns: true },
                            { key: "A1", label: "ITC of preceding financial year availed in the financial year (included in 6A above) other than ITC reclaimed under rule 37/37A", ns: true },
                            { key: "A2", label: "Net ITC of the financial year = (A - A1)", ns: true },
                        ].map((r) => (
                            <tr key={r.key}>
                                <td className={`${tdBase} font-semibold`}>{r.key}</td>
                                <td className={tdBase}>{r.label}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}

                        {[
                            { key: "B", label: "Inward supplies (other than imports and inward supplies liable to reverse charge but includes services received from SEZs)" },
                            { key: "C", label: "Inward supplies received from unregistered persons liable to reverse charge (other than B above) on which tax is paid & ITC availed" },
                            { key: "D", label: "Inward supplies received from registered persons liable to reverse charge (other than B above) on which tax is paid and ITC availed" },
                        ].map((sec, si) => (
                            <React.Fragment key={sec.key}>
                                {["Inputs", "Capital Goods", "Input Services"].map((type, ti) => (
                                    <tr key={ti} className={(si + ti) % 2 === 0 ? "" : "bg-gray-50"}>
                                        {ti === 0 && (
                                            <td className={`${tdBase} font-semibold`} rowSpan={3}>{sec.key}</td>
                                        )}
                                        {ti === 0 && (
                                            <td className={tdBase} rowSpan={3}>{sec.label}</td>
                                        )}
                                        <td className={tdBase}>{type}</td>
                                        <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                                        <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* E Import of goods */}
                        {["Inputs", "Capital Goods"].map((type, ti) => (
                            <tr key={ti} className={ti % 2 === 0 ? "" : "bg-gray-50"}>
                                {ti === 0 && <td className={`${tdBase} font-semibold`} rowSpan={2}>E</td>}
                                {ti === 0 && <td className={tdBase} rowSpan={2}>Import of goods (including supplies from SEZs)</td>}
                                <td className={tdBase}>{type}</td>
                                <td className={tdBase}></td><td className={tdBase}></td>
                                <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                            </tr>
                        ))}

                        <tr>
                            <td className={`${tdBase} font-semibold`}>F</td>
                            <td className={tdBase}>Import of services (excluding inward supplies from SEZs)</td>
                            <td className={tdBase}></td>
                            <td className={tdBase}></td><td className={tdBase}></td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>

                        {["G - Input Tax credit received from ISD", "H - Amount of ITC reclaimed under the provisions of the Act"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{label.split(" - ")[0]}</td>
                                <td className={tdBase}>{label.split(" - ")[1]}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}

                        <tr className={subtotalRow}>
                            <td className={`${tdBase} font-semibold`}>I</td>
                            <td className={tdBase}>Sub-total (B to H above)</td>
                            <td className={tdBase}></td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>

                        {["J - Difference (I-A2 above)", "K - Transition Credit through TRAN-I (including revisions if any)", "L - Transition Credit through TRAN-II", "M - ITC availed through ITC-01, ITC-02 and ITC-02A (other than GSTR-3B and TRAN Forms)", "N - Sub-total (K to M above)", "O - Total ITC availed (I+ N above)"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{label.split(" - ")[0]}</td>
                                <td className={tdBase}>{label.split(" - ").slice(1).join(" - ")}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}

                        <tr>
                            <td className={subHeader} colSpan={7}>
                                7 &nbsp; Details of ITC Reversed and Ineligible ITC as declared in returns filed during the financial year
                            </td>
                        </tr>

                        {["A - As per Rule 37", "A1 - As per Rule 37A", "A2 - As per Rule 38", "B - As per Rule 39", "C - As per Rule 42", "D - As per Rule 43", "E - As per section 17(5)", "F - Reversal of TRAN-I credit", "G - Reversal of TRAN-II credit", "H - Other reversals (pl. specify)", "I - Total ITC Reversed (A to H above)", "J - Net ITC Available for Utilization (6O - 7I)"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{label.split(" - ")[0]}</td>
                                <td className={tdBase}>{label.split(" - ").slice(1).join(" - ")}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}

                        <tr>
                            <td className={subHeader} colSpan={7}>8 &nbsp; Other ITC related information</td>
                        </tr>

                        {["A - ITC as per GSTR-2B (table thereof)", "B - ITC as per 6(B) above", "C - ITC on inward supplies received during 2017-18 but availed during April to September, 2018", "D - Difference [A-(B+C)]", "E - ITC available but not availed (out of D)", "F - ITC available but ineligible (out of D)", "G - IGST paid on import of goods (including supplies from SEZ)", "H - IGST credit availed on import of goods (as per 6(E) above) in the financial year", "H1 - IGST Credit availed on Import of goods in next financial year", "I - Difference [G-(H +H1)]", "J - ITC available but not availed on import of goods (Equal to I)", "K - Total ITC to be lapsed in current financial year (E + F + J)"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={`${tdBase} font-semibold`}>{label.split(" - ")[0]}</td>
                                <td className={tdBase}>{label.split(" - ").slice(1).join(" - ")}</td>
                                <td className={nsCell} colSpan={5}>{NS}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pt. IV Tax Paid ── */}
            <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
                <div className={`${sectionHeader} rounded-t-lg`}>
                    Pt. IV &nbsp; Details of tax paid as declared in returns filed during the financial year
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>9</th>
                            <th className={thBase}>Description</th>
                            <th className={`${thBase} text-right`}>Tax Payable</th>
                            <th className={`${thBase} text-right`}>Paid through Cash</th>
                            <th className={`${thBase} text-right`}>Central Tax (ITC)</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax (ITC)</th>
                            <th className={`${thBase} text-right`}>Integrated Tax (ITC)</th>
                            <th className={`${thBase} text-right`}>Cess (ITC)</th>
                            <th className={`${thBase} text-right`}>Total Tax Paid</th>
                            <th className={`${thBase} text-right`}>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {["Integrated Tax", "Central Tax", "State/UT Tax", "Cess", "Interest", "Late fee", "Penalty", "Other"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={tdBase}></td>
                                <td className={tdBase}>{label}</td>
                                <td className={nsCell} colSpan={8}>{NS}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pt. V Previous FY Transactions ── */}
            <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
                <div className={`${sectionHeader} rounded-t-lg`}>
                    Pt. V &nbsp; Particulars of the transactions for the previous FY declared in returns of April to September of current FY or upto date of filing of annual return of previous FY whichever is earlier
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>No.</th>
                            <th className={thBase}>Description</th>
                            <th className={`${thBase} text-right`}>Taxable Value</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={`${tdBase} font-semibold`}>10</td>
                            <td className={tdBase}>Supplies / tax declared through invoices/debit notes/amendments (+)</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>11</td>
                            <td className={tdBase}>Supplies / tax reduced through amendments/credit notes (−)</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>
                        <tr>
                            <td className={`${tdBase} font-semibold`}>12</td>
                            <td className={tdBase}>ITC of the financial year reversed in the next financial year</td>
                            <td className={nsCell} colSpan={5}>{NS}</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>13</td>
                            <td className={tdBase}>ITC of the financial year availed in the next financial year</td>
                            <td className={nsCell} colSpan={5}>{NS}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Sub-table 14 */}
                <div className={`${subHeader} mt-2`}>14 &nbsp; Differential tax paid on account of declaration in 10 &amp; 11 above</div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>Description</th>
                            <th className={`${thBase} text-right`}>Payable</th>
                            <th className={`${thBase} text-right`}>Paid</th>
                            <th className={`${thBase} text-right`}>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { label: "Integrated Tax", payable: "₹0.00" },
                            { label: "Central Tax", payable: "₹0.00" },
                            { label: "State/UT Tax", payable: "₹0.00" },
                            { label: "Cess", payable: "₹0.00" },
                            { label: "Interest", payable: "₹0.00" },
                        ].map((r, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={tdBase}>{r.label}</td>
                                <td className={tdR}>{r.payable}</td>
                                <td className={tdBase}>-</td>
                                <td className={tdBase}>-</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pt. VI Other Information ── */}
            <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
                <div className={`${sectionHeader} rounded-t-lg`}>Pt. VI &nbsp; Other Information</div>

                {/* Section 15 */}
                <div className={subHeader}>15 &nbsp; Particulars of Demands and Refunds</div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>Details</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                            <th className={`${thBase} text-right`}>Interest</th>
                            <th className={`${thBase} text-right`}>Penalty</th>
                            <th className={`${thBase} text-right`}>Late Fee / Others</th>
                        </tr>
                    </thead>
                    <tbody>
                        {["A - Total Refund claimed", "B - Total Refund sanctioned", "C - Total Refund Rejected", "D - Total Refund Pending", "E - Total demand of taxes", "F - Total taxes paid in respect of E above", "G - Total demands pending out of E above"].map((label, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                                <td className={tdBase}>{label.split(" - ").slice(1).join(" - ")}</td>
                                <td className={nsCell} colSpan={7}>{NS}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Section 16 */}
                <div className={subHeader}>16 &nbsp; Information on supplies received from composition taxpayers, deemed supply under section 143 and goods sent on approval basis</div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>Details</th>
                            <th className={`${thBase} text-right`}>Taxable Value</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={tdBase}>A &nbsp; Supplies received from Composition taxpayers</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdBase}></td><td className={tdBase}></td>
                            <td className={tdBase}></td><td className={tdBase}></td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className={tdBase}>B &nbsp; Deemed supply under Section 143</td>
                            <td className={nsCell} colSpan={5}>{NS}</td>
                        </tr>
                        <tr>
                            <td className={tdBase}>C &nbsp; Goods sent on approval basis but not returned</td>
                            <td className={nsCell} colSpan={5}>{NS}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Section 17 */}
                <div className={subHeader}>17 &nbsp; HSN Wise Summary of Outward Supplies</div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>HSN Code</th>
                            <th className={thBase}>UQC</th>
                            <th className={`${thBase} text-right`}>Total Quantity</th>
                            <th className={`${thBase} text-right`}>Taxable Value</th>
                            <th className={`${thBase} text-right`}>Rate of Tax</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={tdBase}>-</td><td className={tdBase}>-</td>
                            <td className={tdBase}></td>
                            <td className={tdR}>₹1,370.00</td>
                            <td className={tdBase}>-</td>
                            <td className={tdR}>₹22.00</td><td className={tdR}>₹22.00</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>
                    </tbody>
                </table>

                {/* Section 18 */}
                {/* <div className={subHeader}>18 &nbsp; HSN Wise Summary of Inward Supplies</div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#E5E0D3]">
                            <th className={thBase}>HSN Code</th>
                            <th className={thBase}>UQC</th>
                            <th className={`${thBase} text-right`}>Total Quantity</th>
                            <th className={`${thBase} text-right`}>Taxable Value</th>
                            <th className={`${thBase} text-right`}>Rate of Tax</th>
                            <th className={`${thBase} text-right`}>Central Tax</th>
                            <th className={`${thBase} text-right`}>State Tax / UT Tax</th>
                            <th className={`${thBase} text-right`}>Integrated Tax</th>
                            <th className={`${thBase} text-right`}>Cess</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={tdBase}>-</td><td className={tdBase}>-</td>
                            <td className={tdBase}></td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdBase}>-</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td><td className={tdR}>₹0.00</td>
                        </tr>
                    </tbody>
                </table> */}
                {/* Section 18 */}
                <div className={subHeader}>18 &nbsp; HSN Wise Summary of Inward Supplies</div>
                <table className="w-full border-collapse">
                    <thead>
                        {/* Row 1: Column labels */}
                        <tr className="bg-white">
                            <th className={`${thBase} text-center`}>HSN<br />Code</th>
                            <th className={`${thBase} text-center`}>UQC</th>
                            <th className={`${thBase} text-center`}>Total<br />Quantity</th>
                            <th className={`${thBase} text-center`}>Taxable<br />Value</th>
                            <th className={`${thBase} text-center`}>Rate of Tax</th>
                            <th className={`${thBase} text-center`}>Central<br />Tax</th>
                            <th className={`${thBase} text-center`}>State Tax /<br />UT Tax</th>
                            <th className={`${thBase} text-center`}>Integrated<br />Tax</th>
                            <th className={`${thBase} text-center`}>Cess</th>
                        </tr>

                        {/* Row 2: Column numbers */}
                        <tr className="bg-[#E5E0D3]">
                            <th className={`${thBase} text-center`}>1</th>
                            <th className={`${thBase} text-center`}>2</th>
                            <th className={`${thBase} text-center`}>3</th>
                            <th className={`${thBase} text-center`}>4</th>
                            <th className={`${thBase} text-center`}>5</th>
                            <th className={`${thBase} text-center`}>6</th>
                            <th className={`${thBase} text-center`}>7</th>
                            <th className={`${thBase} text-center`}>8</th>
                            <th className={`${thBase} text-center`}>9</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className={`${tdBase} text-center`}>-</td>
                            <td className={`${tdBase} text-center`}>-</td>
                            <td className={`${tdBase} bg-gray-100`}></td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-[#1565C0]">₹0.00</td>
                            <td className={`${tdBase} text-center`}>-</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                            <td className={tdR}>₹0.00</td>
                        </tr>
                    </tbody>
                </table>

                {/* Section 19 */}
                {/* Section 19 */}
                <div className={subHeader}>19 &nbsp; Late fee payable and paid</div>
                <table className="w-full border-collapse">
                    <thead>
                        {/* Row 1: Column labels */}
                        <tr className="bg-white">
                            <th className={`${thBase} text-center`}></th>
                            <th className={`${thBase} text-center`}>Description</th>
                            <th className={`${thBase} text-center`}>Payable</th>
                            <th className={`${thBase} text-center`}>Paid</th>
                        </tr>

                        {/* Row 2: Column numbers */}
                        <tr className="bg-[#E5E0D3]">
                            <th className={`${thBase} text-center`}></th>
                            <th className={`${thBase} text-center`}>1</th>
                            <th className={`${thBase} text-center`}>2</th>
                            <th className={`${thBase} text-center`}>3</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className={`${tdBase} font-semibold`}>A</td>
                            <td className={`${tdBase} font-semibold`}>Central Tax</td>
                            <td className={nsCell} colSpan={2}>{NS}</td>
                        </tr>

                        <tr className="bg-gray-50">
                            <td className={`${tdBase} font-semibold`}>B</td>
                            <td className={`${tdBase} font-semibold`}>State Tax</td>
                            <td className={nsCell} colSpan={2}>{NS}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GSTR9Summary;