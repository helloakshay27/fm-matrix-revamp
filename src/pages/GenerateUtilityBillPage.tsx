import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Database, Droplets, Loader2 } from 'lucide-react';
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
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

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

// Column configuration for results table
const columns: ColumnConfig[] = [
  { key: 'entity_name', label: 'Client Name', sortable: true, defaultVisible: true },
  { key: 'asset_name', label: 'Meter No.', sortable: true, defaultVisible: true },
  { key: 'location', label: 'Location', sortable: true, defaultVisible: true },
  { key: 'reading_type', label: 'Reading Type', sortable: true, defaultVisible: true },
  { key: 'adjustment_factor', label: 'Adjustment Factor', sortable: true, defaultVisible: true },
  { key: 'consumption', label: 'Actual Consumption', sortable: true, defaultVisible: true },
  { key: 'total_consumption', label: 'Total Consumption', sortable: true, defaultVisible: true },
  { key: 'rate', label: 'Rate', sortable: true, defaultVisible: true },
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

  const [kiosks, setKiosks] = useState<[string, number][]>([]);
  const [kiosksLoading, setKiosksLoading] = useState(false);
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);
  const [wings, setWings] = useState<{ id: number; name: string }[]>([]);
  const [wingsLoading, setWingsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [kioskConsumption, setKioskConsumption] = useState<string>('');
  const [transmissionLoss, setTransmissionLoss] = useState<string>('');
  const [totalLoss, setTotalLoss] = useState<string>('');
  const [consumptionLoss, setConsumptionLoss] = useState<string>('');

  useEffect(() => {
    const fetchKiosks = async () => {
      try {
        setKiosksLoading(true);
        const url = new URL(getFullUrl('/customer_monthly_consumptions/kiosk_list.json'));
        if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);
        const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: [string, number][] = await response.json();
        setKiosks(data);
      } catch (error) {
        console.error('Error fetching kiosk list:', error);
      } finally {
        setKiosksLoading(false);
      }
    };

    const fetchBuildings = async () => {
      try {
        setBuildingsLoading(true);
        const siteId = localStorage.getItem('site_id') || localStorage.getItem('selectedSiteId') || '';
        const url = new URL(getFullUrl(`/pms/sites/${siteId}/buildings.json`));
        if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);
        const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBuildings(data.buildings || []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      } finally {
        setBuildingsLoading(false);
      }
    };

    fetchKiosks();
    fetchBuildings();
  }, []);

  const fetchWings = async (buildingId: string) => {
    if (!buildingId) { setWings([]); return; }
    try {
      setWingsLoading(true);
      const url = new URL(getFullUrl(`/pms/buildings/${buildingId}/wings.json`));
      if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);
      const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].wings) {
        setWings(data.flatMap((item: any) => item.wings || []));
      } else if (Array.isArray(data.wings)) {
        setWings(data.wings);
      } else {
        setWings([]);
      }
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setWingsLoading(false);
    }
  };

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

  const fetchTotalConsumption = async () => {
    try {
      setResultsLoading(true);
      const url = new URL(getFullUrl('/customer_monthly_consumptions/total_consumption.json'));
      if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);

      const typeMap: Record<string, string> = { EB: 'EBKVAH', DG: 'DGKVAH', Water: 'Water' };
      url.searchParams.append('type', typeMap[formData.utilityType] || formData.utilityType);
      url.searchParams.append('start_date', formData.fromDate);
      url.searchParams.append('end_date', formData.toDate);
      if (formData.tower) url.searchParams.append('building_id[]', formData.tower);
      if (formData.wing) url.searchParams.append('wing_id[]', formData.wing);
      if (formData.kiosk) url.searchParams.append('parent_meter_id[]', formData.kiosk);

      const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setResults(Array.isArray(data) ? data : data.customer_monthly_consumptions || []);

      const tc = data['total_consumption'];
      const vl = parseFloat(formData.consumptionEB);
      if (tc) {
        const af = vl / tc;
        handleInputChange('totalConsumption', String(tc));
        handleInputChange('adjustment', af.toFixed(5));

        console.log('Fetched Total Consumption:', tc, '| Consumption as per EB:', vl, '| Adjustment Factor:', af.toFixed(5), '| Kiosk Consumption:', kioskConsumption);
          const kc = parseFloat(kioskConsumption);
          const tLoss = vl  - kc;           // consumption as per EB - total - kiosk consumption
          const cLoss = kc - tc; 
          const totalLoss = tLoss + cLoss;               // kiosk consumption - total consumption
          setTransmissionLoss(tLoss.toFixed(5));
          setConsumptionLoss(cLoss.toFixed(5));
          setTotalLoss(totalLoss.toFixed(5));
        console.log('Total Consumption:', tc, '| Adjustment Factor:', af, '| Transmission Loss:', tLoss, '| Consumption Loss:', cLoss, '| Total Loss:', totalLoss);
      }
    } catch (error) {
      console.error('Error fetching total consumption:', error);
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    if (!formData.kiosk || !formData.fromDate || !formData.toDate) return;
    const fetchKioskConsumption = async () => {
      try {
        const typeMap: Record<string, string> = { EB: 'EBKVAH', DG: 'DGKVAH', Water: 'Water' };
        const url = new URL(getFullUrl('/customer_monthly_consumptions/kiosk_consumption'));
        if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);
        url.searchParams.append('id', formData.kiosk);
        url.searchParams.append('start_date', formData.fromDate);
        url.searchParams.append('end_date', formData.toDate);
        url.searchParams.append('type', typeMap[formData.utilityType] || formData.utilityType);
        const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setKioskConsumption(data?.total_consumption != null ? String(data.total_consumption) : '0');
      } catch (error) {
        console.error('Error fetching kiosk consumption:', error);
      }
    };
    fetchKioskConsumption();
  }, [formData.kiosk, formData.fromDate, formData.toDate, formData.utilityType]);

  const handleKioskChange = (kioskId: string) => {
    handleInputChange('kiosk', kioskId);
  };

  const handleGenerateAdjustmentFactor = () => {
    fetchTotalConsumption();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = new URL(getFullUrl('/customer_monthly_consumptions/new.json'));
      if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);

      const typeMap: Record<string, string> = { EB: 'EBKVAH', DG: 'DGKVAH', Water: 'Water' };
      url.searchParams.append('start_date', formData.fromDate);
      url.searchParams.append('end_date', formData.toDate);
      url.searchParams.append('boardkwh', formData.consumptionEB);
      url.searchParams.append('adjustment_factor', formData.adjustment);
      url.searchParams.append('rate', formData.ratePerKWH);
      url.searchParams.append('type', typeMap[formData.utilityType] || formData.utilityType);
      if (formData.kiosk) url.searchParams.append('parent_meter_id[]', formData.kiosk);
      if (formData.tower) url.searchParams.append('building_id[]', formData.tower);
      if (formData.wing) url.searchParams.append('wing_id[]', formData.wing);
      url.searchParams.append('plant_detail_id', '');
      url.searchParams.append('customer_id', '');

      const response = await fetch(url.toString(), getAuthenticatedFetchOptions());
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setResults(data.table || []);
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };

  const handleGenerateUtilityConsumption = async () => {
    try {
      const typeMap: Record<string, string> = { EB: 'EBKVAH', DG: 'DGKVAH', Water: 'Water' };
      const payload = {
        reading_type: typeMap[formData.utilityType] || formData.utilityType,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        rate: formData.ratePerKWH,
        building_id: formData.tower,
        wing_id: formData.wing,
        cids: results.map((r: any) => r.id),
      };

      const url = new URL(getFullUrl('/compile_utilizations.json'));
      if (API_CONFIG.TOKEN) url.searchParams.append('access_token', API_CONFIG.TOKEN);

      const response = await fetch(url.toString(), {
        ...getAuthenticatedFetchOptions('POST'),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Compile utilization response:', data);
    } catch (error) {
      console.error('Error compiling utilization:', error);
    }
  };

  const handleCancel = () => {
    navigate('/utility/utility-consumption');
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'entity_name':
        return <span className="font-medium">{item.entity_name || '-'}</span>;
      case 'asset_name':
        return <span className="font-mono text-sm">{item.asset_name || '-'}</span>;
      case 'location':
        return <span className="text-sm">{item.location || '-'}</span>;
      case 'reading_type':
        return <span>{item.reading_type || '-'}</span>;
      case 'adjustment_factor':
        return <span>{item.adjustment_factor ?? '-'}</span>;
      case 'consumption':
        return <span>{item.consumption ?? '-'}</span>;
      case 'total_consumption':
        return <span>{item.total_consumption ?? '-'}</span>;
      case 'rate':
        return <span>₹{item.rate ?? '-'}</span>;
      case 'amount':
        return <span className="font-medium text-green-600">₹{item.amount ?? '-'}</span>;
      default:
        return item[columnKey] ?? '-';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">Utility &gt; Generate Bill</div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-600 hover:text-gray-900 p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-semibold text-2xl text-gray-900">Utility Billing Calculation</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── STEP 1 ── */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-[#f6f4ee] border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#C72030] text-white text-sm font-bold">1</span>
              <CardTitle className="text-base font-semibold text-gray-800">Select Filters & Utility Type</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">

            {/* Utility Type */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Utility Type</p>
              <RadioGroup row value={formData.utilityType} onChange={handleUtilityTypeChange} className="flex gap-4">
                <FormControlLabel
                  value="EB"
                  control={<Radio size="small" />}
                  label={
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${formData.utilityType === 'EB' ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'}`}>
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-sm">EB</span>
                    </div>
                  }
                />
                <FormControlLabel
                  value="DG"
                  control={<Radio size="small" />}
                  label={
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${formData.utilityType === 'DG' ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'}`}>
                      <Database className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-sm">DG</span>
                    </div>
                  }
                />
                <FormControlLabel
                  value="Water"
                  control={<Radio size="small" />}
                  label={
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${formData.utilityType === 'Water' ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'}`}>
                      <Droplets className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-sm">Water</span>
                    </div>
                  }
                />
              </RadioGroup>
            </div>

            <div className="border-t border-gray-100" />

            {/* Row 1: From Date | To Date | Select KIOSK | Kiosk Consumption | Consumption as per EB */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <TextField
                label="From Date"
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { height: '45px', backgroundColor: '#f6f4ee' } }}
              />
              <TextField
                label="To Date"
                type="date"
                value={formData.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { height: '45px', backgroundColor: '#f6f4ee' } }}
              />
              <FormControl fullWidth>
                <InputLabel id="kiosk-label">Select KIOSK</InputLabel>
                <Select
                  labelId="kiosk-label"
                  name="kiosk"
                  value={formData.kiosk}
                  onChange={(e) => handleKioskChange(e.target.value as string)}
                  label="Select KIOSK"
                  disabled={kiosksLoading}
                  sx={{ height: '45px', backgroundColor: '#f6f4ee' }}
                >
                  {kiosksLoading ? <MenuItem disabled>Loading...</MenuItem> : kiosks.map(([name, id]) => (
                    <MenuItem key={id} value={String(id)}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Kiosk Consumption"
                value={kioskConsumption}
                disabled
                fullWidth
                placeholder="Auto-filled"
                sx={{ '& .MuiOutlinedInput-root': { height: '45px', backgroundColor: '#f0f0f0' } }}
              />
              <TextField
                label={formData.utilityType === 'DG' ? 'Consumption as per DG' : formData.utilityType === 'Water' ? 'Consumption as per Water (KL)' : 'Consumption as per EB'}
                type="number"
                name="consumptionEB"
                value={formData.consumptionEB}
                onChange={(e) => handleInputChange('consumptionEB', e.target.value)}
                placeholder="Enter numeric value"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { height: '45px', backgroundColor: '#f6f4ee' } }}
              />
            </div>

            {/* Row 2: Select Tower | Select Wing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl fullWidth>
                <InputLabel id="tower-label">Select Tower</InputLabel>
                <Select
                  labelId="tower-label"
                  name="tower"
                  value={formData.tower}
                  onChange={(e) => { handleSelectChange(e); handleInputChange('wing', ''); fetchWings(e.target.value as string); }}
                  label="Select Tower"
                  disabled={buildingsLoading}
                  sx={{ height: '45px', backgroundColor: '#f6f4ee' }}
                >
                  {buildingsLoading ? <MenuItem disabled>Loading...</MenuItem> : buildings.map((b) => (
                    <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="wing-label">Select Wing</InputLabel>
                <Select
                  labelId="wing-label"
                  name="wing"
                  value={formData.wing}
                  onChange={handleSelectChange}
                  label="Select Wing"
                  disabled={wingsLoading || !formData.tower}
                  sx={{ height: '45px', backgroundColor: '#f6f4ee' }}
                >
                  {wingsLoading ? <MenuItem disabled>Loading...</MenuItem>
                    : wings.length === 0 ? <MenuItem disabled>No wings available</MenuItem>
                    : wings.map((w) => <MenuItem key={w.id} value={String(w.id)}>{w.name}</MenuItem>)}
                </Select>
              </FormControl>
              {/* <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Total Consumption</p>
                <div className="h-[45px] flex items-center px-4 bg-gray-50 border border-gray-200 rounded text-gray-800 font-semibold text-sm">
                  {formData.totalConsumption || <span className="text-gray-400">Auto-filled after Step 1</span>}
                </div>
              </div> */}
              <TextField
                label="Total Consumption"
                type="number"
                name="consumptionEB"
                value={formData.totalConsumption || "Auto-filled after Step 1"}
                disabled
                placeholder="Enter numeric value"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { height: '45px', backgroundColor: '#f6f4ee' } }}
              />

            </div>

            {/* Generate Adjustment Factor - centered at bottom of Step 1 */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={handleGenerateAdjustmentFactor}
                disabled={resultsLoading}
                className="h-[45px] px-10 bg-[#C72030] hover:bg-[#A01B29] text-white rounded-none font-medium flex items-center gap-2"
              >
                {resultsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Generate Adjustment Factor
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* ── STEP 2 ── */}
        <Card className={`border shadow-sm transition-all ${formData.totalConsumption ? 'border-green-300' : 'border-gray-200 opacity-60'}`}>
          <CardHeader className="bg-[#f6f4ee] border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#C72030] text-white text-sm font-bold">2</span>
              <CardTitle className="text-base font-semibold text-gray-800">Review & Submit</CardTitle>
              {!formData.totalConsumption && (
                <span className="text-xs text-gray-400 ml-2">— complete Step 1 first</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Adjustment Factor</p>
                <div className="h-[45px] flex items-center px-4 bg-gray-50 border border-gray-200 rounded text-gray-800 font-semibold text-sm">
                  {formData.adjustment || <span className="text-gray-400">Auto-filled after Step 1</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{formData.utilityType === 'Water' ? 'Rate Per KL' : 'Rate Per KWH'}</p>
                <input
                  type="number"
                  value={formData.ratePerKWH}
                  onChange={(e) => handleInputChange('ratePerKWH', e.target.value)}
                  placeholder="Enter rate"
                  required
                  className="h-[45px] w-full px-4 bg-gray-50 border border-gray-200 rounded text-gray-800 font-semibold text-sm outline-none focus:border-gray-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Transmission Loss</p>
                <div className={`h-[45px] flex items-center px-4 border rounded font-semibold text-sm ${transmissionLoss ? (parseFloat(transmissionLoss) >= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700') : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {transmissionLoss ? transmissionLoss : 'Auto-filled after Step 1'}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Consumption Loss</p>
                <div className={`h-[45px] flex items-center px-4 border rounded font-semibold text-sm ${consumptionLoss ? (parseFloat(consumptionLoss) >= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700') : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {consumptionLoss ? consumptionLoss : 'Auto-filled after Step 1'}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Total Loss</p>
                <div className={`h-[45px] flex items-center px-4 border rounded font-semibold text-sm ${totalLoss ? (parseFloat(totalLoss) >= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700') : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {totalLoss ? totalLoss : 'Auto-filled after Step 1'}
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Transmission Loss</p>
                <div className={`h-[45px] flex items-center px-4 border rounded font-semibold text-sm ${transmissionLoss ? (parseFloat(transmissionLoss) >= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700') : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {transmissionLoss ? transmissionLoss : 'Auto-filled after Step 1'}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Consumption Loss</p>
                <div className={`h-[45px] flex items-center px-4 border rounded font-semibold text-sm ${consumptionLoss ? (parseFloat(consumptionLoss) >= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700') : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {consumptionLoss ? consumptionLoss : 'Auto-filled after Step 1'}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Total Loss</p>
                <div className={`h-[45px] flex items-center px-4 border rounded font-semibold text-sm ${totalLoss ? (parseFloat(totalLoss) >= 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700') : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {totalLoss ? totalLoss : 'Auto-filled after Step 1'}
                </div>
              </div>
            </div> */}

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={!formData.totalConsumption || resultsLoading}
                className="h-[45px] px-10 bg-[#C72030] hover:bg-[#A01B29] text-white rounded-none font-medium flex items-center gap-2"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

      </form>

      {/* Results Table */}
      {resultsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin text-[#C72030]" />
        </div>
      ) : results.length > 0 && (
        <>
          <EnhancedTable
            data={results}
            columns={columns}
            renderCell={renderCell}
            enableSearch={false}
            enableExport={false}
            hideColumnsButton={false}
            pagination={false}
            emptyMessage="Submit the form to view results"
            selectable={false}
            storageKey="generate-bill-results-table"
          />
          <div className="flex justify-start">
            <Button
              onClick={handleGenerateUtilityConsumption}
              className="bg-[#C72030] hover:bg-[#A01B29] text-white px-6 h-[45px] rounded-none font-medium"
            >
              Generate Utility Consumption
            </Button>
          </div>
        </>
      )}
    </div>
  );
};