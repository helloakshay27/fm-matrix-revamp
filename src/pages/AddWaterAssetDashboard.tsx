import React, { useState, useEffect } from 'react';
import {
  Activity, BarChart3, Zap, Sun, Droplet, Recycle, BarChart, Plug, Frown, Wind, ArrowDown, ArrowUp, Plus, X, ChevronUp, ChevronDown, Building
} from 'lucide-react';
import { MeterMeasureFields } from '@/components/asset/MeterMeasureFields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useLocation } from "react-router-dom";

import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  FormControlLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  Checkbox as MuiCheckbox,
  FormLabel,
} from '@mui/material';
import apiClient from '@/utils/apiClient';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function AddWaterAssetDashboard() {
  // Asset Meter Type ID mapping based on database values (copied from AddAssetPage)
  const getAssetMeterTypeId = (meterCategory, subCategory = null, tertiaryCategory = null) => {
    const meterTypeMapping = {
      "board": {
        "ht-panel": 5,
        "vcb": 8,
        "transformer": 2,
        "lt-panel": 9,
      },
      "dg": 1,
      "renewable": {
        "solar": 7,
        "bio-methanol": 10,
        "wind": 11,
      },
      "fresh-water": {
        "source": {
          "municipal-corporation": 12,
          "tanker": 13,
          "borewell": 14,
          "rainwater": 15,
          "jackwell": 16,
          "pump": 3,
        },
        "destination": {
          "output": 18,
        }
      },
      "recycled": 6,
      "water-distribution": {
        "irrigation": 17,
        "domestic": 18,
        "flushing": 19,
      },
      "iex-gdam": 21,
    };

    if (tertiaryCategory && meterTypeMapping[meterCategory] &&
      meterTypeMapping[meterCategory][subCategory] &&
      typeof meterTypeMapping[meterCategory][subCategory] === 'object') {
      return meterTypeMapping[meterCategory][subCategory][tertiaryCategory] || null;
    } else if (subCategory && meterTypeMapping[meterCategory] && typeof meterTypeMapping[meterCategory] === 'object') {
      return meterTypeMapping[meterCategory][subCategory] || null;
    } else if (typeof meterTypeMapping[meterCategory] === 'number') {
      return meterTypeMapping[meterCategory];
    }
    return null;
  };

  // Water Distribution Options (copied from AddAssetPage)
  const getWaterDistributionOptions = () => [
    {
      value: "irrigation",
      label: "Irrigation",
      icon: Droplet,
    },
    {
      value: "domestic",
      label: "Domestic",
      icon: Building,
    },
    {
      value: "flushing",
      label: "Flushing",
      icon: ArrowDown,
    },
  ];

  const { toast } = useToast();
  const location = useLocation();

  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const [assetType, setAssetType] = useState(type || "Water");
  console.log("Asset Type:", assetType);

  // --- Meter Details Section State (match AddAssetPage) ---
  const [meterCategoryType, setMeterCategoryType] = useState("");
  const [subCategoryType, setSubCategoryType] = useState("");
  const [tertiaryCategory, setTertiaryCategory] = useState("");
  const [meterType, setMeterType] = useState("");
  const [showBoardRatioOptions, setShowBoardRatioOptions] = useState(false);
  const [showRenewableOptions, setShowRenewableOptions] = useState(false);
  const [showFreshWaterOptions, setShowFreshWaterOptions] = useState(false);
  const [showWaterSourceOptions, setShowWaterSourceOptions] = useState(false);
  const [showWaterDistributionOptions, setShowWaterDistributionOptions] = useState(false);
  const [parentMeters, setParentMeters] = useState([]);
  const [parentMeterLoading, setParentMeterLoading] = useState(false);
  const [selectedParentMeterId, setSelectedParentMeterId] = useState("");

  // Fetch parent meters function (same as AddAssetPage, adapted for fetch)
  const fetchParentMeters = async () => {
    setParentMeterLoading(true);
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    try {
      const response = await fetch(`${baseUrl}/pms/assets/get_parent_asset.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // Transform nested array to object format
      const transformedData = (data.assets || []).map((asset) => ({
        id: asset[0],
        name: asset[1],
      }));
      setParentMeters(transformedData);
    } catch (error) {
      console.error('Error fetching parent meters:', error);
      setParentMeters([]);
    } finally {
      setParentMeterLoading(false);
    }
  };

  // Fetch parent meters when Sub Meter is selected
  useEffect(() => {
    if (meterType === "SubMeter") {
      fetchParentMeters();
    } else {
      setSelectedParentMeterId("");
    }
    // eslint-disable-next-line
  }, [meterType]);
  const [meterUnitTypes, setMeterUnitTypes] = useState([]);
  const [loadingUnitTypes, setLoadingUnitTypes] = useState(false);
  const [consumptionMeasureFields, setConsumptionMeasureFields] = useState([
    {
      id: '1',
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    },
  ]);
  const [nonConsumptionMeasureFields, setNonConsumptionMeasureFields] = useState([
    {
      id: '1',
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    },
  ]);

  // --- Meter Details Option Functions (match AddAssetPage) ---

  // --- Meter Details Handlers (match AddAssetPage) ---

  // --- Meter Details Section State (must be before handlers) ---

  // --- Fresh water options and handlers ---
  // Form data state (moved to the top to avoid TDZ issues)
  const [formData, setFormData] = useState({
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    assetName: '',
    assetNo: '',
    equipmentId: '',
    modelNo: '',
    serialNo: '',
    consumerNo: '',
    purchaseCost: '',
    capacity: '',
    unit: '',
    group: '',
    subgroup: '',
    purchasedOnDate: '',
    expiryDate: '',
    manufacturer: '',
    locationType: 'common',
    assetType: 'parent',
    status: 'inUse',
    critical: 'no',
    meterApplicable: false,
    underWarranty: 'no',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: '',
    selectedMeterCategories: [],
    selectedMeterCategory: '',
    boardSubCategory: '',
    renewableSubCategory: '',
    freshWaterSubCategory: '',
  });

  // Location dropdown states
  const [sites, setSites] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [wings, setWings] = useState([]);
  const [areas, setAreas] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState({
    sites: false,
    buildings: false,
    wings: false,
    areas: false,
    floors: false,
    rooms: false,
  });

  // Group/Subgroup states
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [subgroupsLoading, setSubgroupsLoading] = useState(false);

  // Fetch Sites
  const fetchSites = async () => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    setLoading((prev) => ({ ...prev, sites: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/sites.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSites(data.sites || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch Buildings
  const fetchBuildings = async (siteId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!siteId) {
      setBuildings([]);
      return;
    }
    setLoading((prev) => ({ ...prev, buildings: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/sites/${siteId}/buildings.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setBuildings(data.buildings || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    } finally {
      setLoading((prev) => ({ ...prev, buildings: false }));
    }
  };

  // Fetch Wings
  const fetchWings = async (buildingId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!buildingId) {
      setWings([]);
      return;
    }
    setLoading((prev) => ({ ...prev, wings: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/buildings/${buildingId}/wings.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // Flatten if API returns [{wings: {...}}, ...]
      let wingsArr = [];
      if (Array.isArray(data)) {
        if (data.length > 0 && data[0].wings) {
          wingsArr = data.map((item) => item.wings);
        } else {
          wingsArr = data;
        }
      }
      setWings(wingsArr);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setLoading((prev) => ({ ...prev, wings: false }));
    }
  };

  // Fetch Areas
  const fetchAreas = async (wingId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!wingId) {
      setAreas([]);
      return;
    }
    setLoading((prev) => ({ ...prev, areas: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/wings/${wingId}/areas.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoading((prev) => ({ ...prev, areas: false }));
    }
  };

  // Fetch Floors
  const fetchFloors = async (areaId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!areaId) {
      setFloors([]);
      return;
    }
    setLoading((prev) => ({ ...prev, floors: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/areas/${areaId}/floors.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    } finally {
      setLoading((prev) => ({ ...prev, floors: false }));
    }
  };

  // Fetch Rooms
  const fetchRooms = async (floorId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!floorId) {
      setRooms([]);
      return;
    }
    setLoading((prev) => ({ ...prev, rooms: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/floors/${floorId}/rooms.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // Extract rooms from the nested structure
      const roomsArray = Array.isArray(data) ? data.map(item => item.rooms) : [];
      setRooms(roomsArray);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading((prev) => ({ ...prev, rooms: false }));
    }
  };

  // Fetch Groups
  const fetchGroups = async () => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    setGroupsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/pms/assets/get_asset_group_sub_group.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setGroups(data.asset_groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Fetch Subgroups
  const fetchSubgroups = async (groupId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!groupId) {
      setSubgroups([]);
      return;
    }
    setSubgroupsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSubgroups(data.asset_groups || []);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
      setSubgroups([]);
    } finally {
      setSubgroupsLoading(false);
    }
  };

  // Initial fetch for sites and groups
  useEffect(() => {
    fetchSites();
    fetchGroups();
  }, []);

  // Fetch buildings when site changes
  useEffect(() => {
    if (formData.site) {
      fetchBuildings(formData.site);
    } else {
      setBuildings([]);
      setFormData((f) => ({ ...f, building: '', wing: '', area: '', floor: '', room: '' }));
    }
  }, [formData.site]);

  // Fetch wings when building changes
  useEffect(() => {
    if (formData.building) {
      fetchWings(formData.building);
    } else {
      setWings([]);
      setFormData((f) => ({ ...f, wing: '', area: '', floor: '', room: '' }));
    }
  }, [formData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    if (formData.wing) {
      fetchAreas(formData.wing);
    } else {
      setAreas([]);
      setFormData((f) => ({ ...f, area: '', floor: '', room: '' }));
    }
  }, [formData.wing]);

  // Fetch floors when area changes
  useEffect(() => {
    if (formData.area) {
      fetchFloors(formData.area);
    } else {
      setFloors([]);
      setFormData((f) => ({ ...f, floor: '', room: '' }));
    }
  }, [formData.area]);

  // Fetch rooms when floor changes
  useEffect(() => {
    if (formData.floor) {
      fetchRooms(formData.floor);
    } else {
      setRooms([]);
      setFormData((f) => ({ ...f, room: '' }));
    }
  }, [formData.floor]);

  // Fetch subgroups when group changes
  useEffect(() => {
    if (formData.group) {
      fetchSubgroups(formData.group);
    } else {
      setSubgroups([]);
      setFormData((f) => ({ ...f, subgroup: '' }));
    }
  }, [formData.group]);

  const navigate = useNavigate();
  const [locationOpen, setLocationOpen] = useState(true);
  const [assetOpen, setAssetOpen] = useState(true);
  const [warrantyOpen, setWarrantyOpen] = useState(true);
  const [meterCategoryOpen, setMeterCategoryOpen] = useState(true);
  const [consumptionOpen, setConsumptionOpen] = useState(true);
  const [nonConsumptionOpen, setNonConsumptionOpen] = useState(true);
  const [attachmentsOpen, setAttachmentsOpen] = useState(true);

  // --- Meter Details Section State (copied from AddAssetPage) ---
  const [meterDetailsToggle, setMeterDetailsToggle] = useState(false);

  // --- Meter Details Section Helpers (copied from AddAssetPage) ---
  const getMeterCategoryOptions = () => [
    { value: 'board', label: 'Board', icon: BarChart3 },
    { value: 'dg', label: 'DG', icon: Zap },
    { value: 'renewable', label: 'Renewable', icon: Sun },
    { value: 'fresh-water', label: 'Fresh Water', icon: Droplet },
    { value: 'recycled', label: 'Recycled', icon: Recycle },
    { value: 'water-distribution', label: 'Water Distribution', icon: Building },
    { value: 'iex-gdam', label: 'IEX-GDAM', icon: BarChart },
  ];
  const getBoardRatioOptions = () => [
    { value: 'ht-panel', label: 'HT Panel', icon: Plug },
    { value: 'vcb', label: 'VCB', icon: Activity },
    { value: 'transformer', label: 'Transformer', icon: Zap },
    { value: 'lt-panel', label: 'LT Panel', icon: Frown },
  ];
  const getRenewableOptions = () => [
    { value: 'solar', label: 'Solar', icon: Sun },
    { value: 'bio-methanol', label: 'Bio Methanol', icon: Droplet },
    { value: 'wind', label: 'Wind', icon: Wind },
  ];
  const getFreshWaterOptions = () => [
    { value: 'source', label: 'Source', icon: ArrowDown },
    { value: 'destination', label: 'Destination', icon: ArrowUp },
  ];
  const getWaterSourceOptions = () => [
    { value: 'municipal-corporation', label: 'Municipal Corporation', icon: BarChart },
    { value: 'tanker', label: 'Tanker', icon: Zap },
    { value: 'borewell', label: 'Borewell', icon: ArrowDown },
    { value: 'rainwater', label: 'Rainwater', icon: BarChart },
    { value: 'jackwell', label: 'Jackwell', icon: ArrowUp },
    { value: 'pump', label: 'Pump', icon: Zap },
  ];
  const handleMeterCategoryChange = (value) => {
    setMeterCategoryType(value);
    setSubCategoryType("");
    setTertiaryCategory("");
    setShowBoardRatioOptions(false);
    setShowRenewableOptions(false);
    setShowFreshWaterOptions(false);
    setShowWaterSourceOptions(false);
    setShowWaterDistributionOptions(false);
    if (value === 'board') {
      setShowBoardRatioOptions(true);
    } else if (value === 'renewable') {
      setShowRenewableOptions(true);
    } else if (value === 'fresh-water') {
      setShowFreshWaterOptions(true);
    } else if (value === 'water-distribution') {
      setShowWaterDistributionOptions(true);
    }
  };
  const handleSubCategoryChange = (value) => {
    setSubCategoryType(value);
    setTertiaryCategory("");
    setShowWaterSourceOptions(false);
    setShowWaterDistributionOptions(false);
    if (meterCategoryType === 'fresh-water' && value === 'source') {
      setShowWaterSourceOptions(true);
    }
    if (meterCategoryType === 'water-distribution') {
      setShowWaterDistributionOptions(true);
    }
  };
  const handleTertiaryCategoryChange = (value) => {
    setTertiaryCategory(value);
  };
  const handleMeterDetailsToggleChange = (checked) => {
    setMeterDetailsToggle(checked);
  };
  // Add, remove, and change handlers for measure fields
  const addMeterMeasureField = (type) => {
    const newField = {
      id: Date.now().toString(),
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    };
    if (type === 'consumption') setConsumptionMeasureFields((prev) => [...prev, newField]);
    else setNonConsumptionMeasureFields((prev) => [...prev, newField]);
  };
  const removeMeterMeasureField = (type, id) => {
    if (type === 'consumption') setConsumptionMeasureFields((prev) => prev.filter((f) => f.id !== id));
    else setNonConsumptionMeasureFields((prev) => prev.filter((f) => f.id !== id));
  };
  const handleMeterMeasureFieldChange = (type, id, field, value) => {
    if (type === 'consumption') {
      setConsumptionMeasureFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    } else {
      setNonConsumptionMeasureFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    }
  };

  const [consumptionMeasures, setConsumptionMeasures] = useState([
    {
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    },
  ]);

  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    {
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    },
  ]);

  const addConsumptionMeasure = () => {
    setConsumptionMeasures([
      ...consumptionMeasures,
      {
        name: '',
        unitType: '',
        min: '',
        max: '',
        alertBelowVal: '',
        alertAboveVal: '',
        multiplierFactor: '',
        checkPreviousReading: false,
      },
    ]);
  };

  const removeConsumptionMeasure = (index) => {
    setConsumptionMeasures(consumptionMeasures.filter((_, i) => i !== index));
  };

  const addNonConsumptionMeasure = () => {
    setNonConsumptionMeasures([
      ...nonConsumptionMeasures,
      {
        name: '',
        unitType: '',
        min: '',
        max: '',
        alertBelowVal: '',
        alertAboveVal: '',
        multiplierFactor: '',
        checkPreviousReading: false,
      },
    ]);
  };

  const removeNonConsumptionMeasure = (index) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving asset:', formData);
    navigate('/utility/water');
  };

  // Helper: Check if any files are present in attachments
  const hasFiles = () => {
    return Object.values(attachments).some((arr) => Array.isArray(arr) && arr.length > 0);
  };

  // Helper: Build category-specific attachments for payload
  const getCategoryAttachments = () => {
    if (!selectedAssetCategory) return {};

    const categoryKey = selectedAssetCategory
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("&", "");

    return {
      asset_image: attachments[`${categoryKey}AssetImage`] || [],
      asset_manuals: attachments[`${categoryKey}ManualsUpload`] || [],
      asset_insurances: attachments[`${categoryKey}InsuranceDetails`] || [],
      asset_purchases: attachments[`${categoryKey}PurchaseInvoice`] || [],
      asset_other_uploads: attachments[`${categoryKey}OtherDocuments`] || [],
      amc_documents: attachments[`${categoryKey}Amc`] || [],
      // Category-specific documents (if any)
      category_attachments: attachments[`${categoryKey}Attachments`] || [],
    };
  };

  // Helper function to get asset type from URL parameter
  const getAssetTypeFromUrl = (urlType) => {
    switch (urlType) {
      case 'Water':
        return 'Water';
      case 'energy':
        return 'Energy';
      case 'stp':
        return 'STP';
      default:
        return 'Water'; // Default fallback
    }
  };

  // Main Save & Create New Asset handler (API flow matches AddAssetPage)
  const [saving, setSaving] = useState(false);
  const handleSaveAndCreateNew = async () => {
    if (saving) return; // Prevent duplicate submissions
    setSaving(true);
    // Build payload (map your formData fields to API keys)
    const payload = {
      pms_asset: {
        name: formData.assetName,
        asset_number: formData.assetNo,
        equipment_id: formData.equipmentId ?? '',
        consumer_number: formData.consumerNo ?? '',
        capacity: formData.capacity ?? '',
        capacity_unit: formData.unit ?? '',
        model_number: formData.modelNo,
        serial_number: formData.serialNo,
        manufacturer: formData.manufacturer,
        status: formData.status === 'inUse' ? 'in_use' : formData.status,
        critical: formData.critical === 'yes' || formData.critical === true,
        is_meter: true,
        pms_site_id: formData.site,
        pms_building_id: formData.building,
        pms_wing_id: formData.wing,
        pms_area_id: formData.area,
        pms_floor_id: formData.floor,
        pms_room_id: formData.room,
        pms_asset_group_id: formData.group,
        pms_asset_sub_group_id: formData.subgroup,
        commisioning_date: formData.commissioningDate,
        purchased_on: formData.purchasedOnDate,
        warranty_expiry: formData.warrantyExpiresOn,
        purchase_cost: formData.purchaseCost,
        type: getAssetTypeFromUrl(type),
        asset_type: assetType,
        meter_tag_type: meterCategoryType,
        asset_meter_type_id: (() => {
          const meterTypeId = getAssetMeterTypeId(meterCategoryType, subCategoryType, tertiaryCategory);
          return typeof meterTypeId === 'number' ? meterTypeId : null;
        })(),
        consumption_pms_asset_measures_attributes: consumptionMeasureFields.map(
          (field) => ({
            name: field.name,
            meter_unit_id: field.unitType,
            min_value: field.min,
            max_value: field.max,
            alert_below: field.alertBelowVal,
            alert_above: field.alertAboveVal,
            multiplier_factor: field.multiplierFactor,
            active: true,
            meter_tag: "Consumption",
            check_previous_reading: field.checkPreviousReading || false,
            _destroy: false,
          })
        ),
        non_consumption_pms_asset_measures_attributes: nonConsumptionMeasureFields.map(
          (field) => ({
            name: field.name,
            meter_unit_id: field.unitType,
            min_value: field.min,
            max_value: field.max,
            alert_below: field.alertBelowVal,
            alert_above: field.alertAboveVal,
            multiplier_factor: field.multiplierFactor,
            active: true,
            meter_tag: "Non Consumption",
            check_previous_reading: field.checkPreviousReading || false,
            _destroy: false,
          })
        ),
        ...getCategoryAttachments(),
      },
    };

    try {
      let response;
      if (hasFiles()) {
        const formDataObj = new FormData();
        Object.entries(payload.pms_asset).forEach(([key, value]) => {
          if (
            ![
              "consumption_pms_asset_measures_attributes",
              "non_consumption_pms_asset_measures_attributes",
            ].includes(key)
          ) {
            if (typeof value === "object" && value !== null && !(value instanceof File)) {
              formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
              formDataObj.append(`pms_asset[${key}]`, String(value));
            }
          }
        });
        payload.pms_asset.consumption_pms_asset_measures_attributes?.forEach((measure, idx) => {
          Object.entries(measure).forEach(([k, v]) => {
            formDataObj.append(
              `pms_asset[consumption_pms_asset_measures_attributes][${idx}][${k}]`,
              String(v)
            );
          });
        });
        payload.pms_asset.non_consumption_pms_asset_measures_attributes?.forEach((measure, idx) => {
          Object.entries(measure).forEach(([k, v]) => {
            formDataObj.append(
              `pms_asset[non_consumption_pms_asset_measures_attributes][${idx}][${k}]`,
              String(v)
            );
          });
        });
        // Add category-specific files dynamically
        if (selectedAssetCategory) {
          const categoryAttachments = getCategoryAttachments();

          // Add asset image (single file)
          if (categoryAttachments.asset_image && categoryAttachments.asset_image.length > 0) {
            formDataObj.append("pms_asset[asset_image]", categoryAttachments.asset_image[0]);
          }

          // Add category-specific documents
          if (categoryAttachments.asset_manuals) {
            categoryAttachments.asset_manuals.forEach((file) =>
              formDataObj.append("asset_manuals[]", file)
            );
          }

          if (categoryAttachments.asset_insurances) {
            categoryAttachments.asset_insurances.forEach((file) =>
              formDataObj.append("asset_insurances[]", file)
            );
          }

          if (categoryAttachments.asset_purchases) {
            categoryAttachments.asset_purchases.forEach((file) =>
              formDataObj.append("asset_purchases[]", file)
            );
          }

          if (categoryAttachments.asset_other_uploads) {
            categoryAttachments.asset_other_uploads.forEach((file) =>
              formDataObj.append("asset_other_uploads[]", file)
            );
          }

          if (categoryAttachments.amc_documents) {
            categoryAttachments.amc_documents.forEach((file) =>
              formDataObj.append("amc_documents[]", file)
            );
          }

          // Add category-specific attachments (if any)
          if (categoryAttachments.category_attachments) {
            const categoryKey = selectedAssetCategory.toLowerCase().replace(/\s+/g, "").replace("&", "");
            categoryAttachments.category_attachments.forEach((file) =>
              formDataObj.append(`${categoryKey}_attachments[]`, file)
            );
          }
        }
        response = await apiClient.post("pms/assets.json", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 300000,
        });
      } else {
        response = await apiClient.post("pms/assets.json", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      toast({
        title: "Asset Created Successfully",
        description: "The asset has been created and saved.",
        duration: 3000,
      });
      // No navigation or reload so user can see the response in the network tab
      // Optionally, you can also log the response for debugging:
      // console.log('API response:', response);
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err?.response?.data?.message || err.message || "An error occurred",
        duration: 6000,
      });
      console.error("Error creating asset:", err);
    } finally {
      setSaving(false);
    }
  };

  // Add selectedAssetCategory state for attachment logic
  const [selectedAssetCategory, setSelectedAssetCategory] = React.useState("Meter");
  // Add attachments state for file uploads (copied from AddAssetPage)
  const [attachments, setAttachments] = React.useState({
    landAttachments: [],
    vehicleAttachments: [],
    leaseholdAttachments: [],
    buildingAttachments: [],
    furnitureAttachments: [],
    itEquipmentAttachments: [],
    machineryAttachments: [],
    toolsAttachments: [],
    meterAttachments: [],
    landManualsUpload: [],
    vehicleManualsUpload: [],
    leaseholdimprovementManualsUpload: [],
    buildingManualsUpload: [],
    furniturefixturesManualsUpload: [],
    itequipmentManualsUpload: [],
    machineryequipmentManualsUpload: [],
    toolsinstrumentsManualsUpload: [],
    meterManualsUpload: [],
    landInsuranceDetails: [],
    vehicleInsuranceDetails: [],
    leaseholdimprovementInsuranceDetails: [],
    buildingInsuranceDetails: [],
    furniturefixturesInsuranceDetails: [],
    itequipmentInsuranceDetails: [],
    machineryequipmentInsuranceDetails: [],
    toolsinstrumentsInsuranceDetails: [],
    meterInsuranceDetails: [],
    landPurchaseInvoice: [],
    vehiclePurchaseInvoice: [],
    leaseholdimprovementPurchaseInvoice: [],
    buildingPurchaseInvoice: [],
    furniturefixturesPurchaseInvoice: [],
    itequipmentPurchaseInvoice: [],
    machineryequipmentPurchaseInvoice: [],
    toolsinstrumentsPurchaseInvoice: [],
    meterPurchaseInvoice: [],
    landOtherDocuments: [],
    vehicleOtherDocuments: [],
    leaseholdimprovementOtherDocuments: [],
    buildingOtherDocuments: [],
    furniturefixturesOtherDocuments: [],
    itequipmentOtherDocuments: [],
    machineryequipmentOtherDocuments: [],
    toolsinstrumentsOtherDocuments: [],
    meterOtherDocuments: [],
    landAmc: [],
    vehicleAmc: [],
    leaseholdimprovementAmc: [],
    buildingAmc: [],
    furniturefixturesAmc: [],
    itequipmentAmc: [],
    machineryequipmentAmc: [],
    toolsinstrumentsAmc: [],
    meterAmc: [],
    landAssetImage: [],
    vehicleAssetImage: [],
    leaseholdimprovementAssetImage: [],
    buildingAssetImage: [],
    furniturefixturesAssetImage: [],
    itequipmentAssetImage: [],
    machineryequipmentAssetImage: [],
    toolsinstrumentsAssetImage: [],
    meterAssetImage: [],
  });

  // File upload logic (copied and adapted from AddAssetPage)
  const handleFileUpload = async (category, files) => {
    if (!files) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB per file
    const maxTotalSize = 50 * 1024 * 1024; // 50MB total
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "text/plain",
    ];

    const fileArray = Array.from(files);
    const processedFiles = [];
    let totalSize = 0;

    // Calculate current total size
    Object.values(attachments).forEach((fileList) => {
      if (Array.isArray(fileList)) {
        fileList.forEach((file) => {
          totalSize += file.size || 0;
        });
      }
    });

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        // Optionally show error/toast here
        continue;
      }
      let processedFile = file;
      // Optionally add image compression logic here if needed
      if (file.size > maxFileSize) {
        // Optionally show error/toast here
        continue;
      }
      if (totalSize + processedFile.size > maxTotalSize) {
        // Optionally show error/toast here
        continue;
      }
      totalSize += processedFile.size;
      processedFiles.push(processedFile);
    }

    if (processedFiles.length > 0) {
      setAttachments((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), ...processedFiles],
      }));
    }
  };

  const removeFile = (category, index) => {
    setAttachments((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-4">
        {/* Location Details */}
        <Card>
          <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    LOCATION DETAILS
                  </span>
                  {locationOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.sites}>
                      <InputLabel>Site*</InputLabel>
                      <MuiSelect
                        value={formData.site}
                        label="Site*"
                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {sites.map((site) => (
                          <MenuItem key={site.id} value={site.id}>
                            {site.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.buildings || !formData.site}>
                      <InputLabel>Building</InputLabel>
                      <MuiSelect
                        value={formData.building}
                        label="Building"
                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {buildings.map((building) => (
                          <MenuItem key={building.id} value={building.id}>
                            {building.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.wings || !formData.building}>
                      <InputLabel>Wing</InputLabel>
                      <MuiSelect
                        value={formData.wing || ''}
                        label="Wing"
                        onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {wings.map((wing, idx) => (
                          <MenuItem key={wing.id || idx} value={wing.id}>
                            {wing.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.areas || !formData.wing}>
                      <InputLabel>Area</InputLabel>
                      <MuiSelect
                        value={formData.area || ''}
                        label="Area"
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {areas.map((area) => (
                          <MenuItem key={area.id} value={area.id}>
                            {area.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.floors || !formData.area}>
                      <InputLabel>Floor</InputLabel>
                      <MuiSelect
                        value={formData.floor || ''}
                        label="Floor"
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {floors.map((floor) => (
                          <MenuItem key={floor.id} value={floor.id}>
                            {floor.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
                <div className="mt-4">
                  <FormControl size="small" sx={{ width: { xs: '100%', md: '20%' } }} disabled={loading.rooms || !formData.floor}>
                    <InputLabel>Room</InputLabel>
                    <MuiSelect
                      value={formData.room || ''}
                      label="Room"
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      sx={{ height: '45px' }}
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Asset Details */}
        <Card>
          <Collapsible open={assetOpen} onOpenChange={setAssetOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    ASSET DETAILS
                  </span>
                  {assetOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextField
                      label="Asset Name*"
                      placeholder="Enter Text"
                      value={formData.assetName}
                      onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Asset No.*"
                      placeholder="Enter Number"
                      value={formData.assetNo}
                      onChange={(e) => setFormData({ ...formData, assetNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Equipment ID*"
                      placeholder="Enter Number"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Model No."
                      placeholder="Enter Number"
                      value={formData.modelNo}
                      onChange={(e) => setFormData({ ...formData, modelNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Serial No."
                      placeholder="Enter Number"
                      value={formData.serialNo}
                      onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Consumer No."
                      placeholder="Enter Number"
                      value={formData.consumerNo}
                      onChange={(e) => setFormData({ ...formData, consumerNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Purchase Cost*"
                      placeholder="Enter Numeric value"
                      value={formData.purchaseCost}
                      onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Capacity"
                      placeholder="Enter Text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Unit"
                      placeholder="Enter Text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <FormControl fullWidth size="small" disabled={groupsLoading}>
                      <InputLabel>Group*</InputLabel>
                      <MuiSelect
                        value={formData.group}
                        label="Group*"
                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {groups.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={subgroupsLoading || !formData.group}>
                      <InputLabel>Subgroup*</InputLabel>
                      <MuiSelect
                        value={formData.subgroup}
                        label="Subgroup*"
                        onChange={(e) => setFormData({ ...formData, subgroup: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {subgroups.map((subgroup) => (
                          <MenuItem key={subgroup.id} value={subgroup.id}>
                            {subgroup.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      label="Purchased ON Date"
                      type="date"
                      value={formData.purchasedOnDate}
                      onChange={(e) => setFormData({ ...formData, purchasedOnDate: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <TextField
                      label="Expiry date"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <FormLabel>Location Type</FormLabel>
                    <MuiRadioGroup
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="common" control={<Radio />} label="Common Area" />
                      <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                      <FormControlLabel value="na" control={<Radio />} label="NA" />
                    </MuiRadioGroup>
                  </div>

                  {/* <div>
                    <FormLabel>Asset Type</FormLabel>
                    <MuiRadioGroup
                      value={formData.assetType}
                      onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="parent" control={<Radio />} label="Parent" />
                      <FormControlLabel value="sub" control={<Radio />} label="Sub" />
                    </MuiRadioGroup>
                  </div> */}

                  <div>
                    <FormLabel>Status</FormLabel>
                    <MuiRadioGroup
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="inUse" control={<Radio />} label="In Use" />
                      <FormControlLabel value="breakdown" control={<Radio />} label="Breakdown" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Critical</FormLabel>
                    <MuiRadioGroup
                      value={formData.critical}
                      onChange={(e) => setFormData({ ...formData, critical: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </MuiRadioGroup>
                  </div>

                  {/* <div className="flex items-center space-x-2">
                    <FormControlLabel
                      control={
                        <MuiCheckbox
                          checked={formData.meterApplicable}
                          onChange={(e) => setFormData({ ...formData, meterApplicable: e.target.checked })}
                        />
                      }
                      label="Meter Applicable"
                    />
                  </div> */}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Warranty Details */}
        <Card>
          <Collapsible open={warrantyOpen} onOpenChange={setWarrantyOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    Warranty Details
                  </span>
                  {warrantyOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Under Warranty</FormLabel>
                    <MuiRadioGroup
                      value={formData.underWarranty}
                      onChange={(e) => setFormData({ ...formData, underWarranty: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </MuiRadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <TextField
                        label="Warranty Start Date"
                        type="date"
                        value={formData.warrantyStartDate}
                        onChange={(e) => setFormData({ ...formData, warrantyStartDate: e.target.value })}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Warranty expires on"
                        type="date"
                        value={formData.warrantyExpiresOn}
                        onChange={(e) => setFormData({ ...formData, warrantyExpiresOn: e.target.value })}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Commissioning Date"
                        type="date"
                        value={formData.commissioningDate}
                        onChange={(e) => setFormData({ ...formData, commissioningDate: e.target.value })}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Meter Category Type */}
        {/* Meter Details (copied and adapted from AddAssetPage) */}
        {/* METER DETAILS with conditional rendering by type param */}
        {(() => {
          // Get type from URL param
          const searchParams = new URLSearchParams(window.location.search);
          const type = searchParams.get('type');

          // For energy, show only Board, DG, Renewable from getMeterCategoryOptions
          let filteredMeterCategoryOptions = getMeterCategoryOptions();
          if (type === 'energy') {
            filteredMeterCategoryOptions = getMeterCategoryOptions().filter(opt => ['Board', 'DG', 'Renewable'].includes(opt.label));
          }

          return (
            <Card>
              <Collapsible open={meterCategoryOpen} onOpenChange={setMeterCategoryOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-black">
                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"><Activity className="w-4 h-4" /></span>
                        METER DETAILS
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">If Applicable</span>
                        <div className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            id="meter-details-toggle"
                            checked={meterDetailsToggle}
                            onChange={e => handleMeterDetailsToggleChange(e.target.checked)}
                          />
                          <label
                            htmlFor="meter-details-toggle"
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${meterDetailsToggle ? 'bg-green-400' : 'bg-gray-300'}`}
                          >
                            <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${meterDetailsToggle ? 'translate-x-6' : 'translate-x-1'}`}></span>
                          </label>
                        </div>
                        {meterCategoryOpen ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className={`${!meterDetailsToggle ? 'opacity-50 pointer-events-none' : ''}`}>
                      {/* Meter Type selection (Parent/Sub) - show for all types */}
                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-[#C72030] font-medium text-sm sm:text-base">Meter Type</span>
                          <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="meter-type-parent"
                                name="meter_tag_type"
                                value="ParentMeter"
                                checked={meterType === 'ParentMeter'}
                                onChange={e => setMeterType(e.target.value)}
                                disabled={!meterDetailsToggle}
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{ accentColor: '#C72030' }}
                              />
                              <label htmlFor="meter-type-parent" className={`text-sm ${!meterDetailsToggle ? 'text-gray-400' : ''}`}>Parent</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="meter-type-sub"
                                name="meter_tag_type"
                                value="SubMeter"
                                checked={meterType === 'SubMeter'}
                                onChange={e => setMeterType(e.target.value)}
                                disabled={!meterDetailsToggle}
                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                style={{ accentColor: '#C72030' }}
                              />
                              <label htmlFor="meter-type-sub" className={`text-sm ${!meterDetailsToggle ? 'text-gray-400' : ''}`}>Sub</label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {meterType === "SubMeter" && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Meter <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={selectedParentMeterId}
                            onValueChange={(value) => {
                              setSelectedParentMeterId(value);
                              setFormData((prev) => ({ ...prev, parent_meter_id: value }));
                            }}
                            disabled={parentMeterLoading || !meterDetailsToggle}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  parentMeterLoading ? "Loading..." : "Select Parent Meter"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {parentMeters.map((meter) => (
                                <SelectItem key={meter.id} value={meter.id.toString()}>
                                  {meter.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="mb-6">
                        <div className="rounded-lg p-4 bg-[#f6f4ee]">
                          <h3 className="font-medium mb-4 text-sm sm:text-base text-orange-700">METER DETAILS</h3>
                          {/* Water: Nested Fresh Water options */}
                          {type === 'Water' ? (
                            <>
                              {/* Top-level: Fresh Water only */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                  <div className="flex items-center justify-center space-x-2">
                                    <input
                                      type="radio"
                                      id="fresh-water"
                                      name="meterCategory"
                                      value="fresh-water"
                                      checked={meterCategoryType === 'fresh-water'}
                                      onChange={e => { setMeterCategoryType('fresh-water'); setSubCategoryType(''); setTertiaryCategory(''); }}
                                      className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                      style={{ accentColor: '#C72030' }}
                                    />
                                    <Droplet className="w-4 h-4 text-gray-600" />
                                    <label htmlFor="fresh-water" className="text-xs sm:text-sm cursor-pointer">Fresh Water</label>
                                  </div>
                                </div>
                              </div>
                              {/* If Fresh Water selected, show Source/Destination */}
                              {meterCategoryType === 'fresh-water' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                  {getFreshWaterOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`fresh-water-${option.value}`}
                                            name="freshWaterCategory"
                                            value={option.value}
                                            checked={subCategoryType === option.value}
                                            onChange={e => { setSubCategoryType(option.value); setTertiaryCategory(''); }}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={`fresh-water-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {/* If Source or Destination selected, show Water Source options */}
                              {meterCategoryType === 'fresh-water' && (subCategoryType === 'source' || subCategoryType === 'destination') && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                                  {getWaterSourceOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`water-source-${option.value}`}
                                            name="waterSourceCategory"
                                            value={option.value}
                                            checked={tertiaryCategory === option.value}
                                            onChange={e => setTertiaryCategory(option.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={`water-source-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {/* Energy: Only Board, DG, Renewable */}
                              {type === 'energy' && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                                  {filteredMeterCategoryOptions.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={option.value}
                                            name="meterCategory"
                                            value={option.value}
                                            checked={meterCategoryType === option.value}
                                            onChange={e => handleMeterCategoryChange(e.target.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {/* Default: show all options as before */}
                              {type !== 'energy' && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                                  {getMeterCategoryOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={option.value}
                                            name="meterCategory"
                                            value={option.value}
                                            checked={meterCategoryType === option.value}
                                            onChange={e => handleMeterCategoryChange(e.target.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {/* All sub-options for WaterAsset are hidden above */}
                              {showBoardRatioOptions && (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                  {getBoardRatioOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`board-${option.value}`}
                                            name="boardRatioCategory"
                                            value={option.value}
                                            checked={subCategoryType === option.value}
                                            onChange={e => setSubCategoryType(e.target.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={`board-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {showRenewableOptions && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                  {getRenewableOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`renewable-${option.value}`}
                                            name="renewableCategory"
                                            value={option.value}
                                            checked={subCategoryType === option.value}
                                            onChange={e => setSubCategoryType(e.target.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={`renewable-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {showFreshWaterOptions && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                  {getFreshWaterOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`fresh-water-${option.value}`}
                                            name="freshWaterCategory"
                                            value={option.value}
                                            checked={subCategoryType === option.value}
                                            onChange={e => handleSubCategoryChange(e.target.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={`fresh-water-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {showWaterSourceOptions && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                                  {getWaterSourceOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`water-source-${option.value}`}
                                            name="waterSourceCategory"
                                            value={option.value}
                                            checked={tertiaryCategory === option.value}
                                            onChange={e => handleTertiaryCategoryChange(e.target.value)}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: '#C72030' }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label htmlFor={`water-source-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {showWaterDistributionOptions && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                  {getWaterDistributionOptions().map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <div
                                        key={option.value}
                                        className="p-3 sm:p-4 rounded-lg text-center bg-white border"
                                      >
                                        <div className="flex items-center justify-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`water-distribution-${option.value}`}
                                            name="waterDistributionCategory"
                                            value={option.value}
                                            checked={subCategoryType === option.value}
                                            onChange={(e) => {
                                              handleSubCategoryChange(e.target.value);
                                            }}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                            style={{ accentColor: "#C72030" }}
                                          />
                                          <IconComponent className="w-4 h-4 text-gray-600" />
                                          <label
                                            htmlFor={`water-distribution-${option.value}`}
                                            className="text-xs sm:text-sm cursor-pointer"
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {meterType === 'ParentMeter' && (
                        <>
                          <MeterMeasureFields
                            title="CONSUMPTION METER MEASURE"
                            fields={consumptionMeasureFields}
                            showCheckPreviousReading={true}
                            onFieldChange={(id, field, value) => handleMeterMeasureFieldChange('consumption', id, field, value)}
                            onAddField={() => addMeterMeasureField('consumption')}
                            onRemoveField={id => removeMeterMeasureField('consumption', id)}
                            unitTypes={meterUnitTypes}
                            loadingUnitTypes={loadingUnitTypes}
                          />
                          <MeterMeasureFields
                            title="NON CONSUMPTION METER MEASURE"
                            fields={nonConsumptionMeasureFields}
                            showCheckPreviousReading={false}
                            onFieldChange={(id, field, value) => handleMeterMeasureFieldChange('nonConsumption', id, field, value)}
                            onAddField={() => addMeterMeasureField('nonConsumption')}
                            onRemoveField={id => removeMeterMeasureField('nonConsumption', id)}
                            unitTypes={meterUnitTypes}
                            loadingUnitTypes={loadingUnitTypes}
                          />
                        </>
                      )}
                      {meterType === 'SubMeter' && (
                        <MeterMeasureFields
                          title="NON CONSUMPTION METER MEASURE"
                          fields={nonConsumptionMeasureFields}
                          showCheckPreviousReading={false}
                          onFieldChange={(id, field, value) => handleMeterMeasureFieldChange('nonConsumption', id, field, value)}
                          onAddField={() => addMeterMeasureField('nonConsumption')}
                          onRemoveField={id => removeMeterMeasureField('nonConsumption', id)}
                          unitTypes={meterUnitTypes}
                          loadingUnitTypes={loadingUnitTypes}
                        />
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })()}


        {/* Attachments */}
        <Card>
          <Collapsible open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    ATTACHMENTS
                  </span>
                  {attachmentsOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="p-4 sm:p-6">
                  {/* Category-specific Asset Image */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Asset Image
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={(e) =>
                          handleFileUpload(
                            `${selectedAssetCategory
                              .toLowerCase()
                              .replace(/\s+/g, "")
                              .replace("&", "")}AssetImage`,
                            e.target.files
                          )
                        }
                        className="hidden"
                        id="asset-image-upload"
                        multiple={false}
                      />
                      <label
                        htmlFor="asset-image-upload"
                        className="cursor-pointer block"
                      >
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-[#C72030] font-medium text-xs sm:text-sm">
                            Choose Asset Image
                          </span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {(() => {
                              const categoryKey = `${selectedAssetCategory
                                .toLowerCase()
                                .replace(/\s+/g, "")
                                .replace("&", "")}AssetImage`;
                              return attachments[categoryKey]?.length > 0
                                ? `${attachments[categoryKey].length} image selected`
                                : "No image chosen";
                            })()}
                          </span>
                        </div>
                      </label>
                      {(() => {
                        const categoryKey = `${selectedAssetCategory
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace("&", "")}AssetImage`;
                        return (
                          attachments[categoryKey]?.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {attachments[categoryKey].map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
                                >
                                  <span className="text-xs sm:text-sm truncate">
                                    {file.name}
                                  </span>
                                  <button
                                    onClick={() => removeFile(categoryKey, index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )
                        );
                      })()}
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("asset-image-upload")?.click()
                          }
                          className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
                        >
                          <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
                          Upload Asset Image
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Common Document Sections for All Categories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      {
                        label: "Manuals Upload",
                        id: "manuals-upload",
                        category: `${selectedAssetCategory
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace("&", "")}ManualsUpload`,
                        accept: ".pdf,.doc,.docx,.txt",
                      },
                      {
                        label: "Insurance Details",
                        id: "insurance-upload",
                        category: `${selectedAssetCategory
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace("&", "")}InsuranceDetails`,
                        accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                      },
                      {
                        label: "Purchase Invoice",
                        id: "invoice-upload",
                        category: `${selectedAssetCategory
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace("&", "")}PurchaseInvoice`,
                        accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                      },
                      {
                        label: "Other Documents",
                        id: "other-upload",
                        category: `${selectedAssetCategory
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace("&", "")}OtherDocuments`,
                        accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                      },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                          {field.label}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            multiple
                            accept={field.accept}
                            onChange={(e) =>
                              handleFileUpload(field.category, e.target.files)
                            }
                            className="hidden"
                            id={field.id}
                          />
                          <label
                            htmlFor={field.id}
                            className="cursor-pointer block"
                          >
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <span className="text-[#C72030] font-medium text-xs sm:text-sm">
                                Choose File
                              </span>
                              <span className="text-gray-500 text-xs sm:text-sm">
                                {attachments[field.category]?.length > 0
                                  ? `${attachments[field.category].length} file(s) selected`
                                  : "No file chosen"}
                              </span>
                            </div>
                          </label>
                          {attachments[field.category]?.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {attachments[field.category].map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
                                >
                                  <span className="text-xs sm:text-sm truncate">
                                    {file.name}
                                  </span>
                                  <button
                                    onClick={() => removeFile(field.category, index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById(field.id)?.click()
                              }
                              className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
                            >
                              <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
                              Upload Files
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleSaveAndCreateNew}
            className="bg-purple-700 text-white hover:bg-purple-800"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save & Create New Asset'}
          </Button>
        </div>

      </div>
    </div>
  );
}

export default AddWaterAssetDashboard;
export { AddWaterAssetDashboard };