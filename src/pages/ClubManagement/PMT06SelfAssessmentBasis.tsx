import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, NotepadText } from "lucide-react";

const PMT06SelfAssessmentBasis: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const calculateDates = (filter: string) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (filter) {
      case "Today":
        start = end = new Date(now);
        break;
      case "Yesterday":
        start = end = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "This Week": {
        const dayOfWeek = now.getDay();
        start = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
        break;
      }
      case "Previous Week": {
        const prevWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const prevDayOfWeek = prevWeekStart.getDay();
        start = new Date(prevWeekStart.getTime() - prevDayOfWeek * 24 * 60 * 60 * 1000);
        end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
        break;
      }
      case "This Month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "Previous Month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "This Quarter": {
        const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
        start = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
        end = new Date(now.getFullYear(), currentQuarter * 3, 0);
        break;
      }
      case "Previous Quarter": {
        const prevQuarter = Math.floor(now.getMonth() / 3);
        if (prevQuarter === 0) {
          start = new Date(now.getFullYear() - 1, 9, 1);
          end = new Date(now.getFullYear() - 1, 11, 31);
        } else {
          start = new Date(now.getFullYear(), (prevQuarter - 1) * 3, 1);
          end = new Date(now.getFullYear(), prevQuarter * 3, 0);
        }
        break;
      }
      case "This Year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case "Previous Year":
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        start = end = now;
    }

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const handleFilterSelect = (option: string) => {
    setSelectedFilter(option);
    if (option === "Custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      calculateDates(option);
    }
  };

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  }, []);

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">
      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            PMT-06 (Self Assessment Basis)
          </h3>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-sm text-gray-600">
            {startDate} to {endDate}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                {selectedFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[
                "Today",
                "This Week",
                "This Month",
                "This Quarter",
                "This Year",
                "Yesterday",
                "Previous Week",
                "Previous Month",
                "Previous Quarter",
                "Previous Year",
                "Custom",
              ].map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleFilterSelect(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showCustom && (
        <div className="flex items-center gap-4 mb-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <Button onClick={() => setShowCustom(false)}>Apply</Button>
        </div>
      )}

      <div className="bg-white border rounded-lg mb-8 overflow-x-auto">
        <h3 className="p-4 font-semibold">
          3.1 Details of Outward Supplies and inward supplies liable to reverse charge
        </h3>
        <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3] text-sm">
                <th className="border px-4 py-2 text-left">Nature of Supply</th>
                <th className="border px-4 py-2 text-right">Integrated Tax</th>
                <th className="border px-4 py-2 text-right">Central Tax</th>
                <th className="border px-4 py-2 text-right">State/UT Tax</th>
                <th className="border px-4 py-2 text-right">CESS Tax</th>
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
              <tr>
                <td className="border px-4 py-2">
                  (a) Outward taxable supplies
                  <br />
                  (other than zero rated, nil rated and exempted)
                </td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹108.88</td>
                <td className="border px-4 py-2 text-right">₹104.82</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  (b) Outward taxable supplies (zero rated)
                </td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right"></td>
                <td className="border px-4 py-2 text-right"></td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  (c) Inward supplies (liable to reverse charge)
                </td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="border px-4 py-2">Total value</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹108.88</td>
                <td className="border px-4 py-2 text-right">₹104.82</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
            </tbody>
          </table>
      </div>

      <div className="bg-white border rounded-lg mb-8 overflow-x-auto">
        <h3 className="p-4 font-semibold">4. Eligible ITC</h3>
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
                <td className="border px-4 py-2" colSpan={5}>
                  (A) ITC Available (whether in full or part)
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">(1) Import of Goods</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right"></td>
                <td className="border px-4 py-2 text-right"></td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">(2) All other ITC</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="border px-4 py-2">Total value</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
            </tbody>
          </table>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <h3 className="p-4 font-semibold">Total Tax Liability (Total(3.1) - Total(4))</h3>
        <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3] text-sm">
                <th className="border px-4 py-2 text-left">Details</th>
                <th className="border px-4 py-2 text-right">Integrated Tax</th>
                <th className="border px-4 py-2 text-right">Central Tax</th>
                <th className="border px-4 py-2 text-right">State/UT Tax</th>
                <th className="border px-4 py-2 text-right">CESS Tax</th>
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
              <tr className="bg-gray-50 font-semibold">
                <td className="border px-4 py-2">Total Tax Liability</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
                <td className="border px-4 py-2 text-right">₹108.88</td>
                <td className="border px-4 py-2 text-right">₹104.82</td>
                <td className="border px-4 py-2 text-right">₹0.00</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default PMT06SelfAssessmentBasis;