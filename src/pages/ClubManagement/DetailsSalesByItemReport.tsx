import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileCog } from 'lucide-react';

const data = [
  {
    customer: "Lockated",
    quantity: 1,
    amount: 490,
    avgPrice: 490,
  },
];

const DetailsSalesByItemReport = () => {
  const { itemName } = useParams<{ itemName: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    // return to item report listing
    navigate('/accounting/reports/sales-by-item');
  };

  const totalQty = data.reduce((sum, r) => sum + r.quantity, 0);
  const totalAmount = data.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 bg-[#f9f7f2] min-h-screen">

      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={handleBack}
            className="mr-4 bg-gray-500 hover:bg-gray-600 text-white p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <FileCog className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Sales by Item - {itemName}
          </h3>
        </div>

        {/* no filters required for details page */}
      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-sm">

            <tr>
              <th className="text-left p-3">Customer Name</th>
              <th className="text-center p-3">Quantity</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-right p-3">Average Price</th>
            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (

              <tr key={index} className="border-t">

                <td className="p-3 text-blue-600">
                  {row.customer}
                </td>

                <td className="p-3 text-center">
                  {row.quantity}
                </td>

                <td className="p-3 text-right">
                  ₹{row.amount.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  ₹{row.avgPrice.toFixed(2)}
                </td>

              </tr>

            ))}

            {/* TOTAL */}

            <tr className="border-t font-semibold bg-gray-50">

              <td className="p-3">Total</td>

              <td className="p-3 text-center">
                {totalQty.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ₹{totalAmount.toFixed(2)}
              </td>

              <td></td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DetailsSalesByItemReport;