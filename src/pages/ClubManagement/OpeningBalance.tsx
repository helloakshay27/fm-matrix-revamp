import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";

const accountNames = [
  "Cash on hand",
  "Investment of Staff Provident Fund",
  "Advances against Staff Provident Fund",
  "Accumulated losses not written off from the reserve or any other fund",
  "Current losses",
  "Statutory Reserve Funds",
  "Building Fund",
  "Special Development Fund",
  "Bad and Doubtful Debts Reserve",
  "Investment Depreciation Fund",
  "Dividend Equalisation Fund",
  "Bonus Equalisation Fund",
  "Reserve for overdue interest",
  "Other Funds",
  "Electricity Charges",
  "Maintenance Charges",
  "Municipal Taxes",
  "Parking Charges",
  "Sub-letting Charges",
  "Water Charges",
  "Building Repair Fund",
  "Municipal Tax Arrears",
  "Sinking Fund",
  "On loans and advances",
  "On investments",
  "Dividend received on shares",
  "Commission",
  "Share Transfer fees",
  "Rent",
  "Rebate in interest",
  "Sale of forms",
  "Other items",
  "Land Income and Expenditure accounts",
  "Interest Paid",
  "Interest Payable",
  "Bank Charges",
  "Salaries and Allowances of Staff",
  "Contribution to Staff Provident Fund",
  "Salary and Allowances of Managing Director",
  "Attendance fees and travelling expenses of Directors and Committee Members",
  "Travelling expenses of staff",
  "Rent, rates and taxes",
  "Postage, Telegram and Telephone charges",
  "Printing and Stationery",
  "Audit fees",
  "General expenses",
  "Bad Debts written off or provision made for bad debts",
  "Depreciation on fixed assets",
  "Land Income and Expenditure account",
  "Other Items",
  "Net Profit carried to Balance Sheet",
  "Sinking Fund",
  "Repair Fund",
  "Common Maintenance Charges",
  "Common Electricity Charges",
  "Common Insurance",
  "Statutory, Water and Other Expenses",
  "Non Occupancy Charges",
  "Interest (*)",
  "Arrears(P)",
  "CGST",
  "SGST",
  "FM - Office",
  "Bills and Payments",
  "A - 101",
  "A - 102",
  "A - 103",
  "B - 101",
  "C - 101",
  "GL - Team",
  "GL - 101",
  "C - 105",
  "Lift Pvt Ltd",
  "KALESHWARI ENGINEERS PRIVATE LIMITED",
  "B - 102",
  "ACHLA CORPORATION",
  "CNW property solutions",
  "Unify Facility Management Pvt Ltd",
  "Cosmos Integrated Solutions Pvt. Ltd.",
  "ANSEC H.R.SERVICES LTD.",
  "TATA",
  "A - 104",
  "Access Card Charges",
  "Water Meter",
  "A - 105",
  "C - 102",
  "C - 203",
  "soc_office",
  "A - 2001",
  "A - 2002",
  "C - 1003",
  "A - 1004",
  "Parking",
  "D - 101",
  "Club Memberships",
  "Multipurpose Hall",
];

const OpeningBalance = () => {
  const [date, setDate] = useState("");
  const [accountValues, setAccountValues] = useState(
    accountNames.reduce(
      (acc, name) => {
        acc[name] = { debit: "", credit: "" };
        return acc;
      },
      {} as Record<string, { debit: string; credit: string }>,
    ),
  );

  const handleValueChange = (
    accountName: string,
    field: "debit" | "credit",
    value: string,
  ) => {
    setAccountValues((prev) => ({
      ...prev,
      [accountName]: {
        ...prev[accountName],
        [field]: value,
      },
    }));
  };

  const calculateTotal = (field: "debit" | "credit") => {
    return Object.values(accountValues).reduce((sum, account) => {
      return sum + Number(account[field] || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-0 m-0">
      <div className="w-full max-w-full px-8 py-8 mx-auto">
        <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
          Opening Balance
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Date Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#C72030] mb-2">
              Opening Balance Date
            </label>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              className="w-64"
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-[#E5E0D3]">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    Accounts
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    Debit (INR)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    Credit (INR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {accountNames.map((accountName) => (
                  <tr key={accountName} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-0.5 text-sm text-gray-700">
                      {accountName}
                    </td>
                    <td className="border border-gray-300 px-4 py-0.5">
                      <TextField
                        size="small"
                        variant="outlined"
                        type="number"
                        value={accountValues[accountName].debit}
                        onChange={(e) =>
                          handleValueChange(
                            accountName,
                            "debit",
                            e.target.value,
                          )
                        }
                        className="w-full"
                        placeholder=""
                        inputProps={{ min: 0 }}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-0.5">
                      <TextField
                        size="small"
                        variant="outlined"
                        type="number"
                        value={accountValues[accountName].credit}
                        onChange={(e) =>
                          handleValueChange(
                            accountName,
                            "credit",
                            e.target.value,
                          )
                        }
                        className="w-full"
                        placeholder=""
                        inputProps={{ min: 0 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculation Summary Box */}
            <div className="flex justify-end mt-6">
              <div className="bg-white rounded-lg shadow p-6 min-w-[320px] max-w-[600px] w-[600px]">
                {/* Total Row */}
                <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Total</span>
                  <div className="flex gap-20">
                    <span className="font-semibold text-gray-700 w-24 text-right">
                      {calculateTotal("debit").toFixed(2)}
                    </span>
                    <span className="font-semibold text-gray-700 w-24 text-right">
                      {calculateTotal("credit").toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Opening Balance Adjustments */}
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-[#C72030]">
                      Opening Balance Adjustments
                    </span>
                    <div className="flex gap-20">
                      <span className="w-24 text-right"></span>
                      <span className="font-medium text-[#C72030] w-24 text-right">
                        {(
                          calculateTotal("debit") - calculateTotal("credit")
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic mb-3">
                    This account will hold the difference in the credits and
                    debits.
                  </p>
                </div>

                {/* Total Amount */}
                <div className="pt-3 border-t border-gray-300">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800">TOTAL AMOUNT</span>
                    <div className="flex gap-20">
                      <span className="w-24 text-right text-gray-800">
                        {calculateTotal("debit").toFixed(2)}
                      </span>
                      <span className="w-24 text-right text-gray-800">
                        {calculateTotal("debit").toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    including Opening Balance Adjustment account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 justify-center">
            <Button
              type="submit"
              className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
            >
              Continue
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
      </div>
    </div>
  );
};

export default OpeningBalance;
