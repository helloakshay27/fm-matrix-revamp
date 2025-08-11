import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Database, Droplets } from 'lucide-react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface BillGenerationFormData {
  fromDate: string;
  toDate: string;
  utilityType: string;
  consumptionEB: string;
  wing: string;
  kiosk: string;
  tower: string;
  totalConsumption: string;
  adjustment: string;
  ratePerKWH: string;
}

// Mock data for the results table
const calculationResults = [
  {
    id: '1',
    clientName: 'SIFY TECHNOLOGIES LTD',
    meterNo: 'MT001',
    location: 'Building A - Floor 1',
    readingType: 'DGKVAH',
    adjustmentFactor: '1.0',
    actualConsumption: '35.93',
    totalConsumption: '35.93',
    amount: '1033.95'
  }
];

// Column configuration for results table
const columns: ColumnConfig[] = [
  { key: 'clientName', label: 'Client Name', sortable: true, defaultVisible: true },
  { key: 'meterNo', label: 'Meter No.', sortable: true, defaultVisible: true },
  { key: 'location', label: 'Location', sortable: true, defaultVisible: true },
  { key: 'readingType', label: 'Reading Type', sortable: true, defaultVisible: true },
  { key: 'adjustmentFactor', label: 'Adjustment Factor', sortable: true, defaultVisible: true },
  { key: 'actualConsumption', label: 'Actual Consumption', sortable: true, defaultVisible: true },
  { key: 'totalConsumption', label: 'Total Consumption', sortable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
];

export const GenerateUtilityBillPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BillGenerationFormData>({
    fromDate: '',
    toDate: '',
    utilityType: 'EB',
    consumptionEB: '',
    wing: '',
    kiosk: '',
    tower: '',
    totalConsumption: '',
    adjustment: '',
    ratePerKWH: ''
  });

  const wings = ['Wing A', 'Wing B', 'Wing C', 'Wing D'];
  const kiosks = ['Kiosk 1', 'Kiosk 2', 'Kiosk 3', 'Kiosk 4'];
  const towers = ['Tower 1', 'Tower 2', 'Tower 3', 'Tower 4'];

  const handleInputChange = (field: keyof BillGenerationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    handleInputChange(name as keyof BillGenerationFormData, value);
  };

  const handleUtilityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('utilityType', event.target.value);
  };

  const handleGenerateAdjustmentFactor = () => {
    // Mock calculation - in real app this would be more complex
    const factor = Math.random() * 0.1 + 0.95; // Random between 0.95 and 1.05
    handleInputChange('adjustment', factor.toFixed(3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
  };

  const handleGenerateUtilityConsumption = () => {
    console.log('Generate utility consumption clicked');
    // This would generate the final consumption data
  };

  const handleCancel = () => {
    navigate('/utility/utility-consumption');
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'clientName':
        return <span className="font-medium text-left">{item.clientName}</span>;
      case 'meterNo':
        return <span className="font-mono text-sm">{item.meterNo}</span>;
      case 'location':
        return item.location || '-';
      case 'readingType':
        return item.readingType || '-';
      case 'adjustmentFactor':
        return <span className="font-medium">{item.adjustmentFactor}</span>;
      case 'actualConsumption':
        return <span className="font-medium">{item.actualConsumption}</span>;
      case 'totalConsumption':
        return <span className="font-medium">{item.totalConsumption}</span>;
      case 'amount':
        return <span className="font-medium text-green-600">{item.amount}</span>;
      default:
        return item[columnKey] || '-';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Generate Bill
      </div>

      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Utility Consumption
        </Button>
      </div>

      {/* Form Card */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="bg-[#f6f4ee] border-b">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-4">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">⚡</span>
            <span>Utility Billing Calculation :</span>
            <div className="flex items-center gap-4 ml-8">
              <TextField
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '35px',
                    backgroundColor: 'white',
                  }
                }}
              />
              <span className="text-gray-600">TO</span>
              <TextField
                type="date"
                value={formData.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '35px',
                    backgroundColor: 'white',
                  }
                }}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {/* Utility Type Selection */}
          <div className="mb-8">
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={formData.utilityType}
                onChange={handleUtilityTypeChange}
                className="flex gap-8"
              >
                <FormControlLabel
                  value="EB"
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-purple-100 min-w-[120px]">
                      <Zap className="w-6 h-6 text-purple-600" />
                      <span className="font-medium">EB</span>
                    </div>
                  }
                />
                <FormControlLabel
                  value="DG"
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-purple-100 min-w-[120px]">
                      <Database className="w-6 h-6 text-purple-600" />
                      <span className="font-medium">DG</span>
                    </div>
                  }
                />
                <FormControlLabel
                  value="Water"
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-purple-100 min-w-[120px]">
                      <Droplets className="w-6 h-6 text-purple-600" />
                      <span className="font-medium">Water</span>
                    </div>
                  }
                />
              </RadioGroup>
            </FormControl>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Consumption as per EB */}
              <div className="space-y-2">
                <TextField
                  label="Consumption as per EB*"
                  type="number"
                  name="consumptionEB"
                  value={formData.consumptionEB}
                  onChange={(e) => handleInputChange('consumptionEB', e.target.value)}
                  placeholder="Numeric Value"
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* Select KIOSK */}
              <div className="space-y-2">
                <FormControl fullWidth>
                  <InputLabel id="kiosk-label">Select KIOSK</InputLabel>
                  <Select
                    labelId="kiosk-label"
                    name="kiosk"
                    value={formData.kiosk}
                    onChange={handleSelectChange}
                    label="Select KIOSK"
                    sx={{
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }}
                  >
                    {kiosks.map((kiosk) => (
                      <MenuItem key={kiosk} value={kiosk}>
                        {kiosk}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Select Tower */}
              <div className="space-y-2">
                <FormControl fullWidth>
                  <InputLabel id="tower-label">Select Tower</InputLabel>
                  <Select
                    labelId="tower-label"
                    name="tower"
                    value={formData.tower}
                    onChange={handleSelectChange}
                    label="Select Tower"
                    sx={{
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }}
                  >
                    {towers.map((tower) => (
                      <MenuItem key={tower} value={tower}>
                        {tower}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Select Wing */}
              <div className="space-y-2">
                <FormControl fullWidth>
                  <InputLabel id="wing-label">Select Wing</InputLabel>
                  <Select
                    labelId="wing-label"
                    name="wing"
                    value={formData.wing}
                    onChange={handleSelectChange}
                    label="Select Wing"
                    sx={{
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }}
                  >
                    {wings.map((wing) => (
                      <MenuItem key={wing} value={wing}>
                        {wing}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Generate Adjustment Factor Button */}
              <div className="space-y-2 flex items-end">
                <Button
                  type="button"
                  onClick={handleGenerateAdjustmentFactor}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-none h-[45px]"
                >
                  Generate Adjustment Factor
                </Button>
              </div>

              <div></div> {/* Empty space for grid alignment */}

              {/* Total Consumption */}
              <div className="space-y-2">
                <TextField
                  label="Total Consumption*"
                  type="number"
                  name="totalConsumption"
                  value={formData.totalConsumption}
                  onChange={(e) => handleInputChange('totalConsumption', e.target.value)}
                  placeholder="Total consumption"
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* Adjustment */}
              <div className="space-y-2">
                <TextField
                  label="Adjustment*"
                  type="number"
                  name="adjustment"
                  value={formData.adjustment}
                  onChange={(e) => handleInputChange('adjustment', e.target.value)}
                  placeholder="Numeric Value"
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>

              {/* Rate Per KWH */}
              <div className="space-y-2">
                <TextField
                  label="Rate Per KWH*"
                  type="number"
                  name="ratePerKWH"
                  value={formData.ratePerKWH}
                  onChange={(e) => handleInputChange('ratePerKWH', e.target.value)}
                  placeholder="Numeric Value"
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      backgroundColor: '#f6f4ee',
                    }
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="bg-[#C72030] hover:bg-[#A01B29] text-white px-8 py-3 rounded-none font-medium transition-colors duration-200"
              >
                Submit
              </Button>
            </div>
          </form>

          {/* Results Table */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <EnhancedTable
                data={calculationResults}
                columns={columns}
                renderCell={renderCell}
                enableSearch={false}
                enableExport={false}
                hideColumnsButton={true}
                pagination={false}
                emptyMessage="No calculation results found"
                selectable={false}
                storageKey="generate-bill-results-table"
              />
            </div>
          </div>

          {/* Generate Utility Consumption Button */}
          <div className="flex justify-start pt-6">
            <Button
              onClick={handleGenerateUtilityConsumption}
              className="bg-[#C72030] hover:bg-[#A01B29] text-white px-6 py-3 rounded-none font-medium transition-colors duration-200"
            >
              Generate Utility Consumption
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};