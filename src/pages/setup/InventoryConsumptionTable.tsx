import React from 'react';
import { Eye } from 'lucide-react';

interface InventoryConsumption {
  month: string;
  consumedValue: number;
  consumptionChange?: number;
  sparesValue: number;
  sparesChange?: number;
  totalValue: number;
  totalChange?: number;
}

const data: InventoryConsumption[] = [
  {
    month: 'Feb 25',
    consumedValue: 50000,
    consumptionChange: 5000,
    sparesValue: 30000,
    sparesChange: 10000,
    totalValue: 80000,
    totalChange: 15000,
  },
  {
    month: 'Jan 25',
    consumedValue: 45000,
    sparesValue: 20000,
    totalValue: 65000,
  },
  {
    month: 'Dec 24',
    consumedValue: 0,
    sparesValue: 0,
    totalValue: 0,
  },
  {
    month: 'Nov 24',
    consumedValue: 0,
    sparesValue: 0,
    totalValue: 0,
  },
];

const getChangeIndicator = (change?: number) => {
  if (change === undefined) return '-';
  return (
    <span className={`ml-1 font-medium ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
      {change > 0 ? `↑ ${change}` : `↓ ${Math.abs(change)}`}
    </span>
  );
};

const InventoryConsumptionTable: React.FC = () => {
  const handleRowClick = (month: string) => {
    alert(`Open detailed view for ${month}`);
  };

  return (
    <div className="overflow-x-auto rounded-md p-6">
      {/* Heading on the left */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Consumption Summary Month</h3>

      <table className="min-w-full text-sm text-left border border-gray-300">
        <thead className="text-gray-700 font-medium">
          <tr>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Month</th>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Consumed (Value)</th>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Consumed prev</th>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Spares (Value)</th>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Spares prev</th>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Total (Value)</th>
            <th className="p-3 border" style={{ backgroundColor: '#f6f4ee' }}>Total prev</th>
          </tr>
        </thead>
        <tbody className="text-gray-900">
          {data.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRowClick(item.month)}
            >
              <td className="p-3 border">{item.month}</td>
              <td className="p-3 border">{item.consumedValue || '-'}</td>
              <td className="p-3 border">{getChangeIndicator(item.consumptionChange)}</td>
              <td className="p-3 border">{item.sparesValue || '-'}</td>
              <td className="p-3 border">{getChangeIndicator(item.sparesChange)}</td>
              <td className="p-3 border">{item.totalValue || '-'}</td>
              <td className="p-3 border">{getChangeIndicator(item.totalChange)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryConsumptionTable;
