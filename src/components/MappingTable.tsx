import React, { useState } from 'react';

interface Measure {
  id: number;
  name: string;
}

interface Input {
  field_name: string;
  field_label: string;
  selected_measure_id: number | null;
}

interface Asset {
  id: number;
  name: string;
  measures: Measure[];
  inputs: Input[];
}

interface MappingTableProps {
  data: Asset[];
}

const MappingTable: React.FC<MappingTableProps> = ({ data }) => {
  const [mappingData, setMappingData] = useState(data);

  const handleMeasureSelect = (assetIndex: number, inputIndex: number, measureId: number) => {
    const updatedData = [...mappingData];
    updatedData[assetIndex].inputs[inputIndex].selected_measure_id = measureId;
    setMappingData(updatedData);
  };

  // Get all unique inputs across all assets for headers
  const getAllInputs = () => {
    const inputsSet = new Set();
    data.forEach(asset => {
      asset.inputs.forEach(input => {
        inputsSet.add(input.field_label);
      });
    });
    return Array.from(inputsSet) as string[];
  };

  const inputHeaders = getAllInputs();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Asset</th>
            {inputHeaders.map((inputLabel, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                {inputLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mappingData.map((asset, assetIndex) => (
            <tr key={asset.id}>
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {asset.name}
              </td>
              {inputHeaders.map((inputLabel, headerIndex) => {
                const input = asset.inputs.find(inp => inp.field_label === inputLabel);
                if (!input) {
                  return (
                    <td key={headerIndex} className="border border-gray-300 px-4 py-2">
                      -
                    </td>
                  );
                }
                
                const inputIndex = asset.inputs.findIndex(inp => inp.field_label === inputLabel);
                
                return (
                  <td key={headerIndex} className="border border-gray-300 px-4 py-2">
                    <select
                      value={input.selected_measure_id || ''}
                      onChange={(e) => handleMeasureSelect(assetIndex, inputIndex, Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Measure</option>
                      {asset.measures.map((measure) => (
                        <option key={measure.id} value={measure.id}>
                          {measure.name}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MappingTable;
