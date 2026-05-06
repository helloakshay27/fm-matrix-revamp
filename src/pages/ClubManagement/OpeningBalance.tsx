import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from '@/config/apiConfig';
import { Search, X } from "lucide-react";
interface AccountOption {
  id: number;
  name: string;
  current_total_debits: number;
  current_total_credits: number;
}
const OpeningBalance = () => {
  const [date, setDate] = useState("");

  // const [accountValues, setAccountValues] = useState(
  //   accountNames.reduce(
  //     (acc, name) => {
  //       acc[name] = { debit: "", credit: "" };
  //       return acc;
  //     },
  //     {} as Record<string, { debit: string; credit: string }>,
  //   ),
  // );


  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountValues, setAccountValues] = useState<Record<string, { debit: string; credit: string }>>({});
  const lock_account_id = localStorage.getItem("lock_account_id");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingAccounts(true);
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      try {
        const url = `${baseUrl}/lock_accounts/${lock_account_id}/lock_account_ledgers.json`;
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        // const options = Array.isArray(response.data)
        //   ? response.data.map((item) => ({ id: item.id, name: item.name }))
        //   : [];

        const options = Array.isArray(response.data)
          ? response.data.map((item) => ({
            id: item.id,
            name: item.name,
            current_total_debits: item.current_total_debits || 0,
            current_total_credits: item.current_total_credits || 0,
          }))
          : [];
        setAccountOptions(options);
        setAccountValues(
          options.reduce((acc, option) => {
            acc[option.name] = { debit: "", credit: "" };
            return acc;
          }, {} as Record<string, { debit: string; credit: string }>)
        );
      } catch (error) {
        setAccountOptions([]);
        console.error('Error fetching account options:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, []);

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

  const filteredAccounts = accountOptions.filter((acc) =>
    acc.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalDebit = filteredAccounts.reduce(
    (sum, acc) => sum + Number(acc.current_total_debits || 0),
    0
  );

  const totalCredit = filteredAccounts.reduce(
    (sum, acc) => sum + Math.abs(Number(acc.current_total_credits || 0)),
    0
  );


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    // Build payload
    const records: any[] = [];
    accountOptions.forEach((option) => {
      const vals = accountValues[option.name];
      if (!vals) return;
      if (vals.debit && Number(vals.debit) > 0) {
        records.push({ ledger_id: option.id, dr: vals.debit });
      }
      if (vals.credit && Number(vals.credit) > 0) {
        records.push({ ledger_id: option.id, cr: vals.credit });
      }
    });
    const payload = {
      lock_account_transaction: {
        transaction_type: "Opening Balance",
        transaction_date: date,
        description: `Opening balances as on ${date}`,
        publish: true,
      },
      lock_account_transaction_records: records,
    };

    console.log('Submitting payload:', payload);
    try {
      const url = `${baseUrl}/lock_accounts/2/lock_account_transactions.json`;
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      // Optionally show success message or redirect
      alert('Opening balance submitted successfully!');
    } catch (error) {
      console.error('Error submitting opening balance:', error);
      alert('Failed to submit opening balance');
    }
  };

  if (loadingAccounts) {
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      </div>
    );
  }

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

          {/* <div className="mb-4">
  <TextField
    label="Search Account"
    variant="outlined"
    size="small"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-80"
  />
</div> */}

          <div className="mb-4 flex justify-end">
            <div className="relative w-[350px]">

              {/* Search Icon */}
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

              {/* Input */}
              <input
                type="text"
                placeholder="Search Account"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030]"
              />

              {/* Clear Button */}
              {search && (
                <X
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 cursor-pointer hover:text-black"
                  onClick={() => setSearch("")}
                />
              )}
            </div>
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto">
            {loadingAccounts ? (
              <div className="flex justify-center items-center py-8">
                <span className="text-gray-500 text-lg">Loading accounts...</span>
              </div>
            ) : (
              <table className="w-full border-collapse border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-[#E5E0D3]">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Accounts
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                      Debit (INR)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                      Credit (INR)
                    </th>
                  </tr>
                </thead>
                {/* <tbody>
                  {accountOptions.map((accountName) => (
                    <tr key={accountName.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-0.5 text-sm text-gray-700">
                        {accountName.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-0.5">
                        <TextField
                          size="small"
                          variant="outlined"
                          type="number"
                          value={accountValues[accountName.name]?.debit || ""}
                          onChange={(e) =>
                            handleValueChange(
                              accountName.name,
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
                          value={accountValues[accountName.name]?.credit || ""}
                          onChange={(e) =>
                            handleValueChange(
                              accountName.name,
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
                </tbody> */}




                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">

                      {/* Account Name */}
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                        {account.name}
                      </td>

                      {/* Debit (READ ONLY) */}
                      <td className="border border-gray-300 px-4 py-2 text-center text-sm text-green-700 font-medium">
                        {Number(account.current_total_debits || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      {/* Credit (READ ONLY) */}
                      <td className="border border-gray-300 px-4 py-2 text-center text-sm text-red-600 font-medium">
                        {Math.abs(Number(account.current_total_credits || 0)).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Calculation Summary Box */}

            <div className="flex justify-end mt-6">
              <div className="bg-white rounded-lg shadow p-6 min-w-[320px] w-[500px]">

                {/* Header */}
                <div className="flex justify-between mb-2 text-sm font-semibold text-gray-600">
                  <span></span>
                  <div className="flex gap-20">
                    <span className="w-24 text-right">Debit</span>
                    <span className="w-24 text-right">Credit</span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="flex justify-between mb-3 pb-3 border-b">
                  <span className="font-semibold">Total</span>
                  <div className="flex gap-20">
                    <span className="w-24 text-right font-semibold text-green-700">
                      {totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="w-24 text-right font-semibold text-red-600">
                      {totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Difference */}
                <div className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#C72030]">
                      Opening Balance Difference
                    </span>
                    <span className="w-24 text-right text-[#C72030] font-medium">
                      {(totalDebit - totalCredit).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    Difference between debit and credit.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-3 pt-4 justify-center">
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

          </div> */}
        </form>
      </div>
    </div>
  );
};

export default OpeningBalance;
