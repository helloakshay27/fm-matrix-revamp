import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Loader2, SlidersHorizontal, ClipboardCheck } from 'lucide-react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useUtilityEvents } from '@/components/PostHogUtilityEvents';

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

const UTILITY_TYPES = [
  { value: 'EB', label: 'EB' },
  { value: 'DG', label: 'DG' },
  { value: 'Water', label: 'Water' },
];

const fieldSx = { '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } };
const readOnlySx = { '& .MuiOutlinedInput-root': { backgroundColor: 'var(--color-surface)' } };

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid var(--color-divider)',
  borderRadius: 16,
  boxShadow: 'none',
  padding: 24,
};

const fieldLabelClass = 'mb-1.5 block text-[12px] font-semibold text-[var(--color-ink-68)]';
const staticBoxClass = 'flex h-[44px] items-center overflow-hidden whitespace-nowrap rounded-xl border px-3.5 text-[13.5px]';

const primaryBtnClass = 'inline-flex h-[42px] min-w-[160px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-[22px] text-[13px] font-semibold leading-none text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed';
const outlineBtnClass = 'inline-flex h-[42px] w-[160px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--color-line)] bg-white px-[22px] text-[13px] font-semibold leading-none text-[var(--color-ink-68)] hover:border-[rgba(26,26,24,0.28)] hover:text-[var(--color-text)]';
const primaryBtnStyle: React.CSSProperties = { backgroundColor: 'var(--color-primary)', color: '#ffffff', boxShadow: 'none' };

const lossBoxClass = (value: string) => {
  if (!value) return 'border-[rgba(26,26,24,0.12)] bg-white text-[var(--color-ink-48)]';
  return parseFloat(value) >= 0
    ? 'border-[var(--color-error)] bg-[var(--color-error-bg)] font-semibold text-[var(--color-text)]'
    : 'border-[var(--color-success-solid)] bg-[var(--color-success-bg)] font-semibold text-[var(--color-text)]';
};

const SectionHeader = ({ icon: Icon, title, note }: { icon: React.ElementType; title: string; note?: string }) => (
  <div className="mb-6 flex items-center gap-2">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)]">
      <Icon className="h-4 w-4 text-[var(--color-text)]" />
    </span>
    <h2 className="m-0 text-[14px] font-semibold uppercase leading-6 tracking-[0.02em] text-[var(--color-text)]">{title}</h2>
    {note && <span className="text-[12px] font-normal normal-case text-[var(--color-ink-48)]">{note}</span>}
  </div>
);

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
  
  const { 
    onUtilityBillWizardOpened, 
    onUtilityBillScopeSelected, 
    onUtilityBillAdjustmentGenerated, 
    onUtilityBillSubmitted 
  } = useUtilityEvents();

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
    onUtilityBillWizardOpened();
  }, [onUtilityBillWizardOpened]);

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
        
        onUtilityBillScopeSelected({
          utility_type: formData.utilityType,
          has_kiosk: !!formData.kiosk,
          tower_set: formData.tower,
          wing_set: formData.wing,
          total_consumption: tc
        });

        onUtilityBillAdjustmentGenerated({
          adjustment_factor: af,
          transmission_loss: tLoss,
          consumption_loss: cLoss,
          total_loss: totalLoss
        });
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
      
      onUtilityBillSubmitted({
        rate_per_kwh: parseFloat(formData.ratePerKWH) || 0,
        amount: data.total_amount || 0, // Fallback if data doesn't have amount
        client_id: '', // Empty as compile works for multiple clients
        meter_id: ''
      });
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
        return <span className="font-medium text-[var(--color-success-solid)]">₹{item.amount ?? '-'}</span>;
      default:
        return item[columnKey] ?? '-';
    }
  };

  const consumptionLabel =
    formData.utilityType === 'DG'
      ? 'Consumption as per DG'
      : formData.utilityType === 'Water'
        ? 'Consumption as per Water (KL)'
        : 'Consumption as per EB';

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-[var(--color-ink-68)]">
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Go back"
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent hover:bg-[var(--color-hover)]"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--color-ink-68)]" />
          </button>
          <span>Utility Consumption</span>
          <span>{'>'}</span>
          <span className="font-medium text-[var(--color-text)]">Generate Bill</span>
        </div>
        <h1 className="m-0 text-2xl font-bold uppercase text-[var(--color-text)]">
          Utility Billing Calculation
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── FILTERS ── */}
          <section style={cardStyle}>
            <SectionHeader icon={SlidersHorizontal} title="Select Filters" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Utility Type */}
              <div>
                <div className="mb-2 text-sm font-medium text-[var(--color-text)]">Utility Type</div>
                <RadioGroup
                  row
                  aria-label="Utility Type"
                  value={formData.utilityType}
                  onChange={(e) => handleInputChange('utilityType', e.target.value)}
                  sx={{
                    gap: 1,
                    '& .MuiFormControlLabel-label': { color: 'var(--color-text)', fontSize: '14px' },
                    '& .MuiRadio-root': { color: 'var(--color-text)', '&.Mui-checked': { color: 'var(--color-text)' } },
                  }}
                >
                  {UTILITY_TYPES.map(({ value, label }) => (
                    <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                  ))}
                </RadioGroup>
              </div>

              {/* Period & location, then readings */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <TextField
                  label="From Date"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
                <TextField
                  label="To Date"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel id="tower-label">Select Tower</InputLabel>
                  <Select
                    labelId="tower-label"
                    name="tower"
                    value={formData.tower}
                    onChange={(e) => { handleSelectChange(e); handleInputChange('wing', ''); fetchWings(e.target.value as string); }}
                    label="Select Tower"
                    disabled={buildingsLoading}
                  >
                    {buildingsLoading ? <MenuItem disabled>Loading...</MenuItem> : buildings.map((b) => (
                      <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={formData.tower ? fieldSx : readOnlySx}>
                  <InputLabel id="wing-label">Select Wing</InputLabel>
                  <Select
                    labelId="wing-label"
                    name="wing"
                    value={formData.wing}
                    onChange={handleSelectChange}
                    label="Select Wing"
                    disabled={wingsLoading || !formData.tower}
                  >
                    {wingsLoading ? <MenuItem disabled>Loading...</MenuItem>
                      : wings.length === 0 ? <MenuItem disabled>No wings available</MenuItem>
                      : wings.map((w) => <MenuItem key={w.id} value={String(w.id)}>{w.name}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel id="kiosk-label">Select KIOSK</InputLabel>
                  <Select
                    labelId="kiosk-label"
                    name="kiosk"
                    value={formData.kiosk}
                    onChange={(e) => handleKioskChange(e.target.value as string)}
                    label="Select KIOSK"
                    disabled={kiosksLoading}
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
                  sx={readOnlySx}
                />
                <TextField
                  label={consumptionLabel}
                  type="number"
                  name="consumptionEB"
                  value={formData.consumptionEB}
                  onChange={(e) => handleInputChange('consumptionEB', e.target.value)}
                  placeholder="Enter numeric value"
                  fullWidth
                  required
                  sx={fieldSx}
                />
                <TextField
                  label="Total Consumption"
                  name="totalConsumption"
                  value={formData.totalConsumption}
                  disabled
                  placeholder="Auto-filled"
                  fullWidth
                  required
                  sx={readOnlySx}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateAdjustmentFactor}
                  disabled={resultsLoading}
                  className={primaryBtnClass}
                  style={primaryBtnStyle}
                >
                  {resultsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Generate Adjustment Factor
                </button>
              </div>
            </div>
          </section>

          {/* ── STEP 2 ── */}
          <section style={cardStyle}>
            <SectionHeader
              icon={ClipboardCheck}
              title="Review & Submit"
              note={!formData.totalConsumption ? 'Generate the adjustment factor first' : undefined}
            />
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                <div>
                  <span className={fieldLabelClass}>Adjustment Factor</span>
                  <div className={`${staticBoxClass} border-[rgba(26,26,24,0.12)] bg-[var(--color-surface)] ${formData.adjustment ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-ink-48)]'}`}>
                    {formData.adjustment || 'Auto-filled'}
                  </div>
                </div>
                <div>
                  <label htmlFor="rate-per-unit" className={fieldLabelClass}>
                    {formData.utilityType === 'Water' ? 'Rate Per KL' : 'Rate Per KWH'}
                  </label>
                  <TextField
                    id="rate-per-unit"
                    type="number"
                    value={formData.ratePerKWH}
                    onChange={(e) => handleInputChange('ratePerKWH', e.target.value)}
                    placeholder="Enter rate"
                    required
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', height: '44px', minHeight: '44px', fontSize: '13.5px' } }}
                  />
                </div>
                <div>
                  <span className={fieldLabelClass}>Transmission Loss</span>
                  <div className={`${staticBoxClass} ${lossBoxClass(transmissionLoss)}`}>
                    {transmissionLoss || 'Auto-filled'}
                  </div>
                </div>
                <div>
                  <span className={fieldLabelClass}>Consumption Loss</span>
                  <div className={`${staticBoxClass} ${lossBoxClass(consumptionLoss)}`}>
                    {consumptionLoss || 'Auto-filled'}
                  </div>
                </div>
                <div>
                  <span className={fieldLabelClass}>Total Loss</span>
                  <div className={`${staticBoxClass} ${lossBoxClass(totalLoss)}`}>
                    {totalLoss || 'Auto-filled'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>

        {/* Results Table */}
        {resultsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--color-ink-68)]" />
          </div>
        ) : results.length > 0 && (
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
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={handleCancel} className={outlineBtnClass}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerateUtilityConsumption}
            disabled={results.length === 0}
            title={results.length === 0 ? 'Generate the adjustment factor first' : undefined}
            className={primaryBtnClass}
            style={primaryBtnStyle}
          >
            Generate Utility Consumption
          </button>
        </div>
      </div>
    </div>
  );
};
