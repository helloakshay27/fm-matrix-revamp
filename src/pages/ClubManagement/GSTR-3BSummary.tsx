import React from "react";

const GSTR3BSummary: React.FC = () => {
    return (
        <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">

            {/* HEADER */}
            <div className="text-center mb-8">
                <div className="text-sm text-gray-500">Lockated</div>

                <h2 className="text-xl font-semibold mt-2">
                    GSTR-3B Summary
                </h2>

                <div className="text-sm text-gray-600 mt-1">
                    March 2026
                </div>
            </div>

            {/* SECTION 3.1 */}

            <div className="bg-white border rounded-lg mb-8 overflow-x-auto">
                <h3 className="p-4 font-semibold">
                    3.1 Details of Outward Supplies and inward supplies liable to reverse charge
                </h3>

                <table className="w-full border-collapse">

                    <thead>
                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-2 text-left">Nature of Supply</th>
                            <th className="border px-4 py-2 text-right">Taxable Value</th>
                            <th className="border px-4 py-2 text-right">Integrated Tax</th>
                            <th className="border px-4 py-2 text-right">Central Tax</th>
                            <th className="border px-4 py-2 text-right">State/UT Tax</th>
                            <th className="border px-4 py-2 text-right">CESS Tax</th>
                        </tr>

                        {/* Column numbers row */}
                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-1 text-center">1</th>
                            <th className="border px-4 py-1 text-center">2</th>
                            <th className="border px-4 py-1 text-center">3</th>
                            <th className="border px-4 py-1 text-center">4</th>
                            <th className="border px-4 py-1 text-center">5</th>
                            <th className="border px-4 py-1 text-center">6</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td className="border px-4 py-2">
                                (a) Outward taxable supplies (other than zero rated, nil rated and exempted)
                            </td>
                            <td className="border px-4 py-2 text-right">₹961.30</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹33.38</td>
                            <td className="border px-4 py-2 text-right">₹29.32</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (b) Outward taxable supplies (zero rated)
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (c) Other outward supplies (Nil rated, exempted)
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (d) Inward supplies (liable to reverse charge)
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (e) Non-GST outward supplies
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                        </tr>

                        {/* Total Row */}
                        <tr className="font-semibold bg-gray-50">
                            <td className="border px-4 py-2">Total value</td>
                            <td className="border px-4 py-2 text-right">₹961.30</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹33.38</td>
                            <td className="border px-4 py-2 text-right">₹29.32</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* SECTION 3.1.1 */}
            <div className="bg-white border rounded-lg mb-8 overflow-x-auto">

                <h3 className="p-4 font-semibold">
                    3.1.1 Details of supplies notified under sub-section (5) of section 9 of the Central Goods and Services Tax Act
                </h3>

                <table className="w-full border-collapse">

                    <thead>
                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-2 text-left">Description</th>
                            <th className="border px-4 py-2 text-right">Taxable Value</th>
                            <th className="border px-4 py-2 text-right">Integrated Tax</th>
                            <th className="border px-4 py-2 text-right">Central Tax</th>
                            <th className="border px-4 py-2 text-right">State/UT Tax</th>
                            <th className="border px-4 py-2 text-right">CESS Tax</th>
                        </tr>

                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-1 text-center">1</th>
                            <th className="border px-4 py-1 text-center">2</th>
                            <th className="border px-4 py-1 text-center">3</th>
                            <th className="border px-4 py-1 text-center">4</th>
                            <th className="border px-4 py-1 text-center">5</th>
                            <th className="border px-4 py-1 text-center">6</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td className="border px-4 py-3">
                                <p>
                                    (i) Taxable supplies on which electronic commerce operator pays tax under Sub-section (5) of Section 9
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    [To be furnished by the electronic commerce operator]
                                </p>
                            </td>

                            <td className="border px-4 py-2 text-right">0</td>
                            <td className="border px-4 py-2 text-right">0</td>
                            <td className="border px-4 py-2 text-right">0</td>
                            <td className="border px-4 py-2 text-right">0</td>
                            <td className="border px-4 py-2 text-right">0</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-3">
                                <p>
                                    (ii) <span className="font-semibold">
                                        Taxable supplies made by the registered person through electronic commerce operator, on which electronic commerce operator is required to pay tax under Sub-section (5) of Section 9
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    [To be furnished by the registered person making supplies through electronic commerce operator]
                                </p>
                            </td>

                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                        </tr>

                    </tbody>

                </table>

            </div>




            {/* SECTION 3.2 */}

            {/* <div className="bg-white border rounded-lg mb-8 overflow-x-auto">

                <h3 className="p-4 font-semibold">
                    3.2 Inter-State supplies made to unregistered persons
                </h3>

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-2 text-left">Nature</th>
                            <th className="border px-4 py-2 text-left">Place of Supply</th>
                            <th className="border px-4 py-2 text-right">Taxable Value</th>
                            <th className="border px-4 py-2 text-right">Integrated Tax</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td className="border px-4 py-2">
                                Supplies made to Unregistered Persons
                            </td>
                            <td className="border px-4 py-2">Maharashtra</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                Supplies made to Composition Taxable Persons
                            </td>
                            <td className="border px-4 py-2">Maharashtra</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                    </tbody>

                </table>

            </div> */}
            <div className="bg-white border rounded-lg mb-8 overflow-x-auto">

                <h3 className="p-4 font-semibold text-sm">
                    3.2 Of the supplies shown in 3.1 (a) above, details of inter-State supplies made to unregistered persons,
                    composition taxable persons and UIN holders
                </h3>

                <table className="w-full border-collapse text-sm">

                    <thead>
                        {/* Row 1: Column labels */}
                        <tr className="bg-white">
                            <th className="border px-4 py-2 text-center font-normal text-gray-600 w-1/4"></th>
                            <th className="border px-4 py-2 text-center font-normal text-gray-600">Place of Supply</th>
                            <th className="border px-4 py-2 text-center font-normal text-gray-600">Taxable Value</th>
                            <th className="border px-4 py-2 text-center font-normal text-gray-600">Integrated Tax</th>
                        </tr>

                        {/* Row 2: Column numbers */}
                        <tr className="bg-[#E5E0D3]">
                            <th className="border px-4 py-2 text-center font-normal">1</th>
                            <th className="border px-4 py-2 text-center font-normal">2</th>
                            <th className="border px-4 py-2 text-center font-normal">3</th>
                            <th className="border px-4 py-2 text-center font-normal">4</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Unregistered Persons group */}
                        <tr className="bg-[#E5E0D3]">
                            <td className="border px-4 py-2 text-gray-600" colSpan={4}>
                                Supplies made to Unregistered Persons
                            </td>
                        </tr>
                        <tr className="bg-white">
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                        </tr>

                        {/* Composition Taxable Persons group */}
                        <tr className="bg-[#E5E0D3]">
                            <td className="border px-4 py-2 text-gray-600" colSpan={4}>
                                Supplies made to Composition Taxable Persons
                            </td>
                        </tr>
                        <tr className="bg-white">
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                        </tr>

                        {/* UIN Holders group */}
                        <tr className="bg-[#E5E0D3]">
                            <td className="border px-4 py-2 text-gray-600" colSpan={4}>
                                Supplies made to UIN holders
                            </td>
                        </tr>
                        <tr className="bg-white">
                            <td className="border px-4 py-2 text-center text-gray-500" colSpan={4}>
                                We are not tracking supplies made to UIN holders
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

            {/* SECTION 4 */}

            {/* SECTION 4 */}

            <div className="bg-white border rounded-lg mb-8 overflow-x-auto">

                <h3 className="p-4 font-semibold">
                    4. Eligible ITC
                </h3>

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-2 text-left">Details</th>
                            <th className="border px-4 py-2 text-center">Integrated Tax</th>
                            <th className="border px-4 py-2 text-center">Central Tax</th>
                            <th className="border px-4 py-2 text-center">State/UT Tax</th>
                            <th className="border px-4 py-2 text-center">CESS Tax</th>
                        </tr>

                        <tr className="bg-[#E5E0D3] text-sm font-semibold">
                            <th className="border px-4 py-2 text-center">1</th>
                            <th className="border px-4 py-2 text-center">2</th>
                            <th className="border px-4 py-2 text-center">3</th>
                            <th className="border px-4 py-2 text-center">4</th>
                            <th className="border px-4 py-2 text-center">5</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr className="bg-gray-50 font-medium">
                            <td className="border px-4 py-2">
                                (A) ITC Available (whether in full or part)
                            </td>
                            <td className="border px-4 py-2"></td>
                            <td className="border px-4 py-2"></td>
                            <td className="border px-4 py-2"></td>
                            <td className="border px-4 py-2"></td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (1) Import of Goods
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (2) Import of Services
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right"></td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (3) Inward supplies liable to reverse charge (other than 1 & 2 above)
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (4) Inward supplies from ISD
                            </td>

                            <td
                                colSpan={4}
                                className="border px-4 py-2 text-center text-gray-500"
                            >
                                - - - We do not support in Zoho Books - - -
                            </td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                (5) All other ITC
                            </td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                            <td className="border px-4 py-2 text-right">₹0.00</td>
                        </tr>

                    </tbody>

                </table>

            </div>

            {/* SECTION 5 */}

            <div className="bg-white border rounded-lg overflow-x-auto">

                <h3 className="p-4 font-semibold">
                    5. Values of exempt, nil-rated and non-GST inward supplies
                </h3>

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-[#E5E0D3] text-sm">
                            <th className="border px-4 py-2 text-left">
                                Nature of Supply
                            </th>

                            <th className="border px-4 py-2 text-right">
                                Inter-State Supplies
                            </th>

                            <th className="border px-4 py-2 text-right">
                                Intra-State Supplies
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td className="border px-4 py-2">
                                Composition Scheme, Exempted, Nil Rated
                            </td>

                            <td className="border px-4 py-2 text-right">
                                ₹0.00
                            </td>

                            <td className="border px-4 py-2 text-right">
                                ₹0.00
                            </td>
                        </tr>

                        <tr>
                            <td className="border px-4 py-2">
                                Non-GST supply
                            </td>

                            <td className="border px-4 py-2 text-right">
                                ₹0.00
                            </td>

                            <td className="border px-4 py-2 text-right">
                                ₹0.00
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div >
    );
};

export default GSTR3BSummary;