import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, Edit, Loader2, Box, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

export const InventoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory-detail');
  const [downloading, setDownloading] = useState(false);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [feedsLoading, setFeedsLoading] = useState(false);
  const [feedsError, setFeedsError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [hsnCodeDisplay, setHsnCodeDisplay] = useState<string>('');
  // Maps for displaying master names instead of IDs in history
  const [invTypeMap, setInvTypeMap] = useState<Record<string, string>>({});
  const [invSubTypeMap, setInvSubTypeMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/pms/inventories/${id}.json`);
        setInventoryData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load inventory details');
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryDetails();
  }, [id]);

  // Fetch inventory types to map IDs -> Names for history display
  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const res = await fetch(`https://${baseUrl}/pms/inventory_types/autocomplete.json`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (aborted) return;
        const arr: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.inventory_types)
            ? data.inventory_types
            : Array.isArray(data?.item_types)
              ? data.item_types
              : Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data?.items)
                  ? data.items
                  : Array.isArray(data?.inventory_types?.data)
                    ? data.inventory_types.data
                    : Array.isArray(data?.item_types?.data)
                      ? data.item_types.data
                      : [];
        const map: Record<string, string> = {};
        arr.forEach((it: any) => {
          const id = it?.id != null ? String(it.id) : undefined;
          const name = it?.name || it?.title || it?.label || '';
          if (id && name) map[id] = String(name);
        });
        setInvTypeMap(map);
      } catch { /* noop */ }
    };
    load();
    return () => { aborted = true; };
  }, []);

  // Fetch sub types for the current inventory type to map IDs -> Names for history display
  useEffect(() => {
    let aborted = false;
    const typeId = (inventoryData as any)?.pms_inventory_type_id
      ?? (inventoryData as any)?.inventory_type_master_id
      ?? (inventoryData as any)?.inventory_type_id
      ?? (inventoryData as any)?.item_type_id;
    if (!typeId) { setInvSubTypeMap({}); return; }
    const load = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const url = `https://${baseUrl}/pms/inventory_types/get_subtype.json?inventory_type_id=${encodeURIComponent(String(typeId))}`;
        const res = await fetch(url, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        if (aborted) return;
        const arr: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.inventory_sub_types)
            ? data.inventory_sub_types
            : Array.isArray(data?.item_sub_types)
              ? data.item_sub_types
              : Array.isArray(data?.item_categories)
                ? data.item_categories
                : Array.isArray(data?.sub_types)
                  ? data.sub_types
                  : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.items)
                      ? data.items
                      : Array.isArray(data?.inventory_sub_types?.data)
                        ? data.inventory_sub_types.data
                        : Array.isArray(data?.item_sub_types?.data)
                          ? data.item_sub_types.data
                          : Array.isArray(data?.item_categories?.data)
                            ? data.item_categories.data
                            : [];
        const map: Record<string, string> = {};
        arr.forEach((it: any) => {
          const id = it?.id != null ? String(it.id) : undefined;
          const name = it?.name || it?.title || it?.label || '';
          if (id && name) map[id] = String(name);
        });
        setInvSubTypeMap(map);
      } catch { /* noop */ }
    };
    load();
    return () => { aborted = true; };
  }, [inventoryData]);

  // Derive or fetch human readable HSN/SAC code
  useEffect(() => {
    if (!inventoryData) return;
    // Try common fields first
    const direct = (inventoryData as any)?.hsc_hsn_code || (inventoryData as any)?.hsn_code || (inventoryData as any)?.hsn?.code;
    if (direct) { setHsnCodeDisplay(direct); return; }
    // If we only have an id, attempt fetch list and map
    const hsnId = (inventoryData as any)?.hsn_id;
    if (!hsnId) { setHsnCodeDisplay(''); return; }
    let aborted = false;
    const load = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const resp = await fetch(`https://${baseUrl}/pms/hsns/get_hsns.json`, { headers: { Authorization: `Bearer ${token}` } });
        if (!resp.ok) return;
        const data = await resp.json();
        if (aborted) return;
        if (Array.isArray(data)) {
          const match = data.find((d: any) => String(d.id) === String(hsnId));
          if (match?.code) setHsnCodeDisplay(match.code);
        }
      } catch { /* silent */ }
    };
    load();
    return () => { aborted = true; };
  }, [inventoryData]);

  // Fetch feeds immediately on page load (once) instead of waiting for history tab
  useEffect(() => {
    if (!id || feedsLoading || feeds.length > 0) return;
    const fetchFeeds = async () => {
      try {
        setFeedsLoading(true);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          setFeedsError('Missing base URL or token');
          return;
        }
        const resp = await fetch(`https://${baseUrl}/pms/inventories/${id}/feeds.json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error('Failed to fetch history');
        const data = await resp.json();
        setFeeds(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error('Feeds fetch error', e);
        setFeedsError('Failed to load history');
      } finally {
        setFeedsLoading(false);
      }
    };
    fetchFeeds();
  }, [id, feedsLoading, feeds.length]);

  const handleBack = () => {
    navigate('/maintenance/inventory');
  };

  const handleFeeds = () => {
    navigate(`/maintenance/inventory/feeds/${id}`);
  };

  const handleEdit = () => {
    navigate(`/maintenance/inventory/edit/${id}`);
  };

  const getInventoryType = (type) => {
    return type === 1 ? 'Spares' : 'Consumable';
  };

  const getCriticality = (criticality) => {
    return criticality === 1 ? 'Critical' : 'Non-Critical';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      let s = String(dateString).trim();
      s = s.replace(/\.\d{3,}/, '');
      s = s.replace(/\s[A-Z]{2,5}\s([+\-]\d{2}:?\d{2})/, ' $1');
      const formats = [
        'ddd, DD MMM YYYY HH:mm:ss ZZ',
        'ddd DD MMM YYYY HH:mm:ss ZZ',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD',
      ];
      let m = moment(s, formats, true);
      if (!m.isValid()) m = moment(s);
      if (!m.isValid()) return '—';
      return m.format('DD/MM/YYYY HH:mm');
    } catch {
      return '—';
    }
  };

  // Sanitize and parse Ruby-style or RFC-like datetimes, then return DD/MM/YYYY
  const formatDateOnly = (dateString) => {
    if (!dateString) return '—';
    try {
      let s = String(dateString).trim();
      // Remove nanoseconds like .000000000
      s = s.replace(/\.\d{3,}/, '');
      // Remove timezone abbreviation tokens (e.g., IST) while keeping numeric offset
      s = s.replace(/\s[A-Z]{2,5}\s([+\-]\d{2}:?\d{2})/, ' $1');
      // Accept common forms explicitly
      const formats = [
        'ddd, DD MMM YYYY HH:mm:ss ZZ',
        'ddd DD MMM YYYY HH:mm:ss ZZ',
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DD HH:mm:ss',
      ];
      let m = moment(s, formats, true);
      if (!m.isValid()) m = moment(s); // best-effort fallback
      if (!m.isValid()) return '—';
      return m.format('DD/MM/YYYY');
    } catch {
      return '—';
    }
  };

  // Parse backend provided changed_attr which may now be an object { key: [old, new] } or legacy Ruby string
  const parseChangedAttr = (raw: any): { key: string; from: string; to: string }[] => {
    if (!raw) return [];
    const rows: { key: string; from: string; to: string }[] = [];

    // New format: object with arrays
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      Object.entries(raw).forEach(([key, val]) => {
        if (Array.isArray(val) && val.length === 2) {
          const [from, to] = val as any[];
          rows.push({ key, from: sanitizeChangedValue(from), to: sanitizeChangedValue(to) });
        }
      });
      return rows;
    }

    // Legacy string format fallback
    if (typeof raw === 'string') {
      try {
        const regex = /"([^\"]+)"=>\[(.*?)\]/g;
        let match;
        while ((match = regex.exec(raw)) !== null) {
          const key = match[1];
          const content = match[2];
          const idx = content.lastIndexOf(',');
          let from = content;
          let to = '';
          if (idx !== -1) {
            from = content.slice(0, idx).trim();
            to = content.slice(idx + 1).trim();
          }
          const clean = (v: string) => v.replace(/^\"|\"$/g, '').replace(/ nil$/i, '—').replace(/^nil$/i, '—');
          rows.push({ key, from: clean(from), to: clean(to) });
        }
      } catch (e) {
        console.warn('Failed to parse legacy changed_attr', e);
      }
    }
    return rows;
  };

  const sanitizeChangedValue = (v: any): string => {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'string') return v === '' ? '—' : v;
    if (typeof v === 'number') return String(v);
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    // If object attempt common keys like name / code
    try {
      if (typeof v === 'object') {
        if ((v as any).name) return String((v as any).name);
        if ((v as any).code) return String((v as any).code);
        return JSON.stringify(v);
      }
    } catch { /* ignore */ }
    return String(v);
  };

  // Human-friendly labels for keys
  const LABELS: Record<string, string> = {
    name: 'Name',
    inventory_type: 'Type',
    pms_inventory_type_id: 'Inventory Type',
    inventory_type_master_id: 'Inventory Type',
    inventory_type_id: 'Inventory Type',
    item_type_id: 'Inventory Type',
    pms_inventory_sub_type_id: 'Inventory Sub Type',
    inventory_sub_type_id: 'Inventory Sub Type',
    item_sub_type_id: 'Inventory Sub Type',
    item_category_id: 'Inventory Sub Type',
    criticality: 'Criticality',
    asset_id: 'Asset',
    code: 'Code',
    serial_number: 'Serial Number',
    quantity: 'Quantity',
    min_stock_level: 'Min Stock Level',
    max_stock_level: 'Max Stock Level',
    min_order_level: 'Min Order Level',
    cgst_rate: 'CGST Rate',
    sgst_rate: 'SGST Rate',
    igst_rate: 'IGST Rate',
    hsn_id: 'SAC/HSN',
    expiry_date: 'Expiry Date',
    unit: 'Unit',
    category: 'Category',
    category_id: 'Category',
    category_name: 'Category',
    inventory_category_id: 'Category',
    pms_inventory_category_id: 'Category',
    pms_inventory_category: 'Category',
    cost: 'Cost',
    rate_contract_vendor_code: 'Rate Contract Vendor',
  };

  const HIDDEN_KEYS = new Set<string>([
    'id', 'created_at', 'updated_at', 'company_id', 'pms_site_id', 'user_id'
  ]);

  const startCase = (s: string) => s.replace(/_/g, ' ')?.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));

  const formatEnum = (key: string, val: string): string => {
    const num = Number(val);
    if (key === 'inventory_type') {
      if (num === 1) return 'Spares';
      if (num === 2) return 'Consumable';
    }
    if (key === 'criticality') {
      if (num === 1) return 'Critical';
      if (num === 0 || num === 2) return 'Non-Critical';
    }
    return val;
  };

  const formatMaybeDate = (key: string, val: string): string => {
    if (!val || val === '—') return '—';
    // Apply for expiry-like keys
    if (key === 'expiry_date' || /expire|expiry|date/i.test(key)) {
      let s = String(val).trim().replace(/^\"|\"$/g, '');
      s = s.replace(/\.\d{3,}/, '');
      s = s.replace(/\s[A-Z]{2,5}\s([+\-]\d{2}:?\d{2})/, ' $1');
      const formats = [
        'ddd, DD MMM YYYY HH:mm:ss ZZ',
        'ddd DD MMM YYYY HH:mm:ss ZZ',
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DD HH:mm:ss',
      ];
      let m = moment(s, formats, true);
      if (!m.isValid()) m = moment(s);
      if (m.isValid()) return m.format('DD/MM/YYYY');
      return val;
    }
    return val;
  };

  const formatNumberLike = (key: string, val: string): string => {
    if (!val || val === '—') return '—';
    const n = Number(val);
    if (!Number.isNaN(n)) {
      // Preserve decimals if present, strip trailing .0
      return n % 1 === 0 ? n.toLocaleString() : n.toLocaleString();
    }
    return val;
  };

  // Normalize and map backend unit to a friendly label from a fixed list
  const formatUnit = (unit: any): string => {
    if (!unit) return '—';
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[\s\._-]/g, '').replace(/\.+/g, '');
    const options = [
      { value: 'Ea', label: 'Each' },
      { value: 'Piece', label: 'Piece' },
      { value: 'Kg', label: 'Kilogram' },
      { value: 'Litre', label: 'Litre' },
      { value: 'Box', label: 'Box' },
      { value: 'Bottle', label: 'Bottle' },
      { value: 'Packet', label: 'Packet' },
      { value: 'Bag', label: 'Bag' },
      { value: 'Qty', label: 'Quantity' },
      { value: 'Meter', label: 'Meter' },
      { value: 'Sq.Mtr', label: 'Square Meter' },
      { value: 'Cu.Mtr', label: 'Cubic Meter' },
      { value: 'Feet', label: 'Feet' },
      { value: 'Sq.Ft', label: 'Square Feet' },
      { value: 'Cu.Ft', label: 'Cubic Feet' },
      { value: 'Inches', label: 'Inches' },
      { value: 'Sq.Inches', label: 'Square Inches' },
      { value: 'Nos', label: 'Numbers' },
      { value: 'Pcs', label: 'Pieces' },
      { value: 'Mm', label: 'Millimeter' },
      { value: 'Size', label: 'Size' },
      { value: 'Yards', label: 'Yards' },
      { value: 'Sq.Yards', label: 'Square Yards' },
      { value: 'Rs', label: 'Rupees' },
      { value: 'Acre', label: 'Acre' },
      { value: 'Kilometer', label: 'Kilometer' },
      { value: 'Miles', label: 'Miles' },
      { value: 'Grams', label: 'Grams' },
      { value: 'Brass', label: 'Brass' },
      { value: 'Tonnes', label: 'Tonnes' },
    ];

    const map = new Map<string, string>();
    options.forEach(o => {
      map.set(normalize(o.value), o.label);
      map.set(normalize(o.label), o.label);
    });

    // Common synonyms from backend
    const synonyms: Record<string, string> = {
      ltr: 'Litre', liter: 'Litre', liters: 'Litre', litre: 'Litre', l: 'Litre',
      qty: 'Quantity', quantity: 'Quantity',
      m: 'Meter', metre: 'Meter',
      sqm: 'Square Meter', squaremeter: 'Square Meter', sqmtr: 'Square Meter', sqmeter: 'Square Meter',
      cumm: 'Cubic Meter', cubicmeter: 'Cubic Meter', cumtr: 'Cubic Meter',
      ft: 'Feet', foot: 'Feet',
      sqft: 'Square Feet', squarefeet: 'Square Feet', sqfeet: 'Square Feet',
      cft: 'Cubic Feet', cubicfeet: 'Cubic Feet',
      inch: 'Inches', in: 'Inches',
      sqinch: 'Square Inches', squareinches: 'Square Inches', sqinches: 'Square Inches',
      nos: 'Numbers', numbers: 'Numbers', no: 'Numbers',
      pcs: 'Pieces', pieces: 'Pieces', piece: 'Piece',
      mm: 'Millimeter', millimeter: 'Millimeter', millimetre: 'Millimeter',
      yd: 'Yards', yard: 'Yards', yards: 'Yards',
      sqyard: 'Square Yards', sqyards: 'Square Yards', squareyards: 'Square Yards',
      rs: 'Rupees', inr: 'Rupees', rupees: 'Rupees',
      km: 'Kilometer', kilometre: 'Kilometer', kilometres: 'Kilometer',
      mile: 'Miles',
      g: 'Grams', gm: 'Grams', gms: 'Grams', gram: 'Grams', grams: 'Grams',
      ton: 'Tonnes', tons: 'Tonnes', tonne: 'Tonnes', mt: 'Tonnes',
    };

    const key = normalize(String(unit));
    if (map.has(key)) return map.get(key)!;
    if (synonyms[key]) return synonyms[key];
    return String(unit); // fallback to original backend data
  };

  const formatValue = (key: string, val: string): string => {
    if (!val || val === '—') return '—';
    // Strip surrounding quotes
    const v = val.replace(/^\"|\"$/g, '');
    // Map master IDs to names for type and sub type if available
    const TYPE_ID_KEYS = new Set(['pms_inventory_type_id', 'inventory_type_master_id', 'inventory_type_id', 'item_type_id']);
    const SUBTYPE_ID_KEYS = new Set(['pms_inventory_sub_type_id', 'inventory_sub_type_id', 'item_sub_type_id', 'item_category_id']);
    if (TYPE_ID_KEYS.has(key)) {
      if (/^\d+$/.test(v) && invTypeMap[v]) return invTypeMap[v];
      return v;
    }
    if (SUBTYPE_ID_KEYS.has(key)) {
      if (/^\d+$/.test(v) && invSubTypeMap[v]) return invSubTypeMap[v];
      return v;
    }
    // Enumerations first
    const enumd = formatEnum(key, v);
    if (enumd !== v) return enumd;
    // Dates
    const dated = formatMaybeDate(key, enumd);
    if (dated !== enumd) return dated;
    // Category-like keys: show as-is (name) or numeric id when no mapping available
    if (['category', 'category_id', 'category_name', 'inventory_category_id', 'pms_inventory_category_id', 'pms_inventory_category'].includes(key)) {
      try {
        // If it looks like a JSON object/string, try to parse out name
        const trimmed = enumd.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          const obj = JSON.parse(trimmed);
          if (obj?.name) return String(obj.name);
        }
      } catch {/* ignore */ }
      return enumd;
    }
    // Numbers for common numeric fields
    if (['quantity', 'min_stock_level', 'max_stock_level', 'min_order_level', 'cgst_rate', 'sgst_rate', 'igst_rate', 'cost'].includes(key)) {
      return formatNumberLike(key, enumd);
    }
    return enumd;
  };

  const toggleRow = (rowId: number) => {
    setExpandedRows(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const relativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const diffMs = Date.now() - date.getTime();
      const sec = Math.floor(diffMs / 1000);
      if (sec < 60) return sec + 's ago';
      const min = Math.floor(sec / 60);
      if (min < 60) return min + 'm ago';
      const hr = Math.floor(min / 60);
      if (hr < 24) return hr + 'h ago';
      const day = Math.floor(hr / 24);
      if (day < 30) return day + 'd ago';
      const mon = Math.floor(day / 30);
      if (mon < 12) return mon + 'mo ago';
      const yr = Math.floor(mon / 12);
      return yr + 'y ago';
    } catch { return ''; }
  };

  const handleDownload = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      toast.error('Missing baseUrl or token');
      return;
    }
    try {
      setDownloading(true);
      const url = `https://${baseUrl}/pms/inventories/inventory_qr_codes.pdf?inventory_ids=[${id}]`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to download QR PDF');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `qr-code-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error('Failed to download QR PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading inventory details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Button variant="ghost" onClick={handleBack} className="w-max">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory List
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleEdit}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {/* <Button onClick={handleFeeds} className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
            Feeds
          </Button> */}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="inventory-detail" className="w-full">
          <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm">
            <TabsTrigger
              value="inventory-detail"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              INVENTORY DETAIL
            </TabsTrigger>
            <TabsTrigger
              value="qr-code"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              QR CODE
            </TabsTrigger>
            <TabsTrigger
              value="asset-information"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              ASSET INFORMATION
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              HISTORY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory-detail" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">INVENTORY DETAIL</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Name</span>
                    <span>: {inventoryData?.name || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Min Stock Level</span>
                    <span>: {inventoryData?.min_stock_level || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Type</span>
                    <span>: {inventoryData?.inventory_type ? getInventoryType(inventoryData.inventory_type) : '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Type Name</span>
                    <span>: {(inventoryData as any)?.inventory_type_name || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Sub Type Name</span>
                    <span>: {(inventoryData as any)?.inventory_sub_type_name || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Criticality</span>
                    <span>: {inventoryData?.criticality ? getCriticality(inventoryData.criticality) : '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Code</span>
                    <span>: {inventoryData?.code || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Serial Number</span>
                    <span>: {inventoryData?.serial_number || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Quantity</span>
                    <span>: {inventoryData?.quantity || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">SGST Rate</span>
                    <span>: {inventoryData?.sgst_rate || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">IGST Rate</span>
                    <span>: {inventoryData?.igst_rate || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Site</span>
                    <span>: {inventoryData?.site || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Active</span>
                    <span>: {inventoryData?.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Rate Contract Vendor</span>
                    <span>: {inventoryData?.rate_contract_vendor_code || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Max Stock Level</span>
                    <span>: {inventoryData?.max_stock_level || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Min. Order Level</span>
                    <span>: {inventoryData?.min_order_level || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">SAC/HSN</span>
                    <span>: {hsnCodeDisplay || (inventoryData?.hsn_id ? String((inventoryData as any).hsn_id) : '—')}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Cost</span>
                    <span>: {inventoryData?.cost || 'NA'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">CGST Rate</span>
                    <span>: {inventoryData?.cgst_rate || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Eco-friendly</span>
                    <span>: {inventoryData?.green_product ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Unit</span>
                    <span>: {formatUnit((inventoryData as any)?.unit)}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Category</span>
                    <span>: {inventoryData?.category || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Expiry Date</span>
                    <span>: {formatDateOnly(inventoryData?.expiry_date)}</span>
                  </div>
                  <div className="flex text-sm items-center">
                    <span className="text-gray-600 w-24">Expired</span>
                    <span className="flex items-center gap-2">
                      :
                      {((inventoryData as any)?.expired === true || String((inventoryData as any)?.expired).toLowerCase() === 'true') ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#C72030]/10 text-[#C72030]">Expired</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">Valid</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border mt-6">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">HISTORY</h2>
              </div>
              <div className="p-4">
                {feedsLoading && (
                  <div className="text-gray-600 text-sm">Loading history...</div>
                )}
                {feedsError && (
                  <div className="text-red-600 text-sm">{feedsError}</div>
                )}
                {!feedsLoading && !feedsError && feeds.length === 0 && (
                  <div className="text-gray-600 text-sm">No history available.</div>
                )}
                {!feedsLoading && !feedsError && feeds.length > 0 && (
                  <div className="rounded-md border border-gray-200 shadow-sm">
                    <div className="max-h-[520px] overflow-y-auto relative">
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur-sm">
                          <tr className="text-xs uppercase tracking-wide text-gray-600">
                            <th className="px-4 py-3 text-left font-semibold">Date / Time</th>
                            <th className="px-4 py-3 text-left font-semibold">Changed By</th>
                            <th className="px-4 py-3 text-left font-semibold">Log Type</th>
                            <th className="px-4 py-3 text-left font-semibold w-2/3">Changes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {feeds.map((feed, idx) => {
                            const changes = parseChangedAttr(feed.changed_attr);
                            const expanded = expandedRows[feed.id];
                            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70';
                            return (
                              <tr
                                key={feed.id}
                                className={`${rowBg} hover:bg-[#f6f4ee] transition-colors`}
                              >
                                <td className="px-4 py-3 align-top whitespace-nowrap text-gray-800">
                                  <div className="flex flex-col">
                                    <span title={feed.created_at}>{formatDateTime(feed.created_at)}</span>
                                    <span className="text-[10px] text-gray-500">{relativeTime(feed.created_at)}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 align-top whitespace-nowrap text-gray-700 font-medium">{feed.changed_by || '—'}</td>
                                <td className="px-4 py-3 align-top">
                                  <span className="inline-block px-2 py-1 rounded-full text-[11px] font-semibold bg-[#C72030]/10 text-[#C72030] whitespace-nowrap leading-none">
                                    {feed.log_type?.replace('Pms::', '') || '—'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 align-top">
                                  {changes.length === 0 && (
                                    <span className="text-gray-400">—</span>
                                  )}
                                  {changes.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                      {(expanded ? changes : changes.slice(0, 3))
                                        .filter(c => !HIDDEN_KEYS.has(c.key))
                                        .map(c => (
                                          <div key={c.key} className="flex items-start flex-wrap gap-1 text-[12px] bg-gray-100 rounded px-2 py-1">
                                            <span className="font-semibold text-gray-700">{LABELS[c.key] || startCase(c.key)}</span>
                                            <span className="text-gray-400 line-through">{formatValue(c.key, c.from)}</span>
                                            <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5" />
                                            <span className="text-green-700 font-semibold">{formatValue(c.key, c.to)}</span>
                                          </div>
                                        ))}
                                      {changes.filter(c => !HIDDEN_KEYS.has(c.key)).length > 3 && (
                                        <button
                                          onClick={() => toggleRow(feed.id)}
                                          className="flex items-center gap-1 self-start text-[11px] text-[#C72030] hover:underline mt-1"
                                        >
                                          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                          {expanded ? 'Show less' : `Show ${changes.filter(c => !HIDDEN_KEYS.has(c.key)).length - 3} more`}
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr-code" className="p-4 sm:p-6">
            <div className="border border-[#D9D9D9] bg-[#F6F7F7] rounded-lg">
              <div className="flex items-center mb-4 bg-[#F6F4EE] p-4">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <QrCode className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">QR CODE</h2>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <img
                    src={inventoryData?.qr_code}
                    alt="QR Code"
                    className="w-40 h-40 object-contain"
                    id="qr-code-img"
                  />
                </div>
                {id && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleDownload}
                      className="mt-2 px-4 mb-5 py-2 bg-[#f6f4ee] text-[#a81a27] rounded transition-colors text-sm font-medium flex items-center justify-center"
                      disabled={downloading}
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        'Download QR Code'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="asset-information" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border mt-6">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">ASSET INFORMATION</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Name</span>
                    <span>: {inventoryData?.asset_name || inventoryData?.name || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Group</span>
                    <span>: {inventoryData?.pms_asset_group || inventoryData?.group || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">SubGroup</span>
                    <span>: {inventoryData?.pms_asset_sub_group || inventoryData?.sub_group || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Site</span>
                    <span>: {inventoryData?.site || '—'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Building</span>
                    <span>: {inventoryData?.building || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Wing</span>
                    <span>: {inventoryData?.wing || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Floor</span>
                    <span>: {inventoryData?.floor || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Area</span>
                    <span>: {inventoryData?.area || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Room</span>
                    <span>: {inventoryData?.room || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};