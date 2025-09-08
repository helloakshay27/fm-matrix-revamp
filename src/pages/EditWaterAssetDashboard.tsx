import React, { useState, useEffect } from 'react';
import {
    Activity, BarChart3, Zap, Sun, Droplet, Recycle, BarChart, Plug, Frown, Wind, ArrowDown, ArrowUp, Plus, X, ChevronUp, ChevronDown, Building
} from 'lucide-react';
import { MeterMeasureFields } from '@/components/asset/MeterMeasureFields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
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

function EditWaterAssetDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    // Get type from URL search params
    const searchParams = new URLSearchParams(location.search);
    const assetType = searchParams.get("type") || "WaterAsset";

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

    // Form data state 
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
        warrantyStatus: '',
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
    const [loadingStates, setLoadingStates] = useState({
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

    // Meter fields states
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

    // File upload states
    const [selectedAssetCategory, setSelectedAssetCategory] = React.useState("");
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

    // Collapsible states
    const [locationOpen, setLocationOpen] = useState(true);
    const [assetOpen, setAssetOpen] = useState(true);
    const [warrantyOpen, setWarrantyOpen] = useState(true);
    const [meterOpen, setMeterOpen] = useState(true);
    const [attachmentsOpen, setAttachmentsOpen] = useState(true);

    // Fetch existing asset data
    const fetchAssetData = async () => {
        if (!id) return;

        setLoading(true);
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
        }

        try {
            const response = await fetch(`${baseUrl}/pms/assets/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch asset: ${response.statusText}`);
            }

            const data = await response.json();
            const asset = data.asset || data;

            // Map API response to form data
            setFormData({
                site: asset.pms_site_id || '',
                building: asset.pms_building_id || '',
                wing: asset.pms_wing_id || '',
                area: asset.pms_area_id || '',
                floor: asset.pms_floor_id || '',
                room: asset.pms_room_id || '',
                assetName: asset.name || '',
                assetNo: asset.asset_number || '',
                equipmentId: asset.equipment_id || '',
                modelNo: asset.model_number || '',
                serialNo: asset.serial_number || '',
                consumerNo: asset.consumer_number || '',
                purchaseCost: asset.purchase_cost ? asset.purchase_cost.toString() : '',
                capacity: asset.capacity || '',
                unit: asset.capacity_unit || '',
                group: asset.pms_asset_group_id || '',
                subgroup: asset.pms_asset_sub_group_id || '',
                purchasedOnDate: asset.purchased_on || '',
                expiryDate: asset.expiry_date || '',
                manufacturer: asset.manufacturer || '',
                locationType: asset.location_type || 'common',
                assetType: asset.asset_type || 'parent',
                status: asset.status === 'in_use' ? 'inUse' : asset.status || 'inUse',
                critical: asset.critical ? 'yes' : 'no',
                meterApplicable: asset.is_meter || false,
                underWarranty: asset.warranty ? 'yes' : 'no',
                warrantyStartDate: asset.warranty_start || '',
                warrantyExpiresOn: asset.warranty_expiry || '',
                warrantyStatus: asset.warranty ? 'active' : 'na',
                commissioningDate: asset.commisioning_date || '',
                selectedMeterCategories: [],
                selectedMeterCategory: asset.meter_tag_type || '',
                boardSubCategory: '',
                renewableSubCategory: '',
                freshWaterSubCategory: '',
            });

            // Set meter-related states
            setMeterCategoryType(asset.meter_tag_type || '');
            setSubCategoryType(''); // Will be determined based on meter_tag_type
            setTertiaryCategory(''); // Will be determined based on meter category
            setMeterType(''); // Not provided in API response
            setSelectedParentMeterId(asset.parent_meter_id || '');

            // For fresh-water meters, we need to determine sub/tertiary categories
            // Based on asset_meter_type_id mapping
            if (asset.meter_tag_type === 'fresh-water') {
                // Looking at the meter type ID 16, this maps to "jackwell" under source
                if (asset.asset_meter_type_id === 16) {
                    setSubCategoryType('source');
                    setTertiaryCategory('jackwell');
                }
            }

            // Set consumption measure fields if they exist
            if (asset.consumption_pms_asset_measures && asset.consumption_pms_asset_measures.length > 0) {
                setConsumptionMeasureFields(asset.consumption_pms_asset_measures.map((measure, index) => ({
                    id: (index + 1).toString(),
                    name: measure.name || '',
                    unitType: measure.meter_unit_id || '',
                    min: measure.min_value || '',
                    max: measure.max_value || '',
                    alertBelowVal: measure.alert_below || '',
                    alertAboveVal: measure.alert_above || '',
                    multiplierFactor: measure.multiplier_factor || '',
                    checkPreviousReading: measure.check_previous_reading || false,
                })));
            }

            // Set non-consumption measure fields if they exist
            if (asset.non_consumption_pms_asset_measures && asset.non_consumption_pms_asset_measures.length > 0) {
                setNonConsumptionMeasureFields(asset.non_consumption_pms_asset_measures.map((measure, index) => ({
                    id: (index + 1).toString(),
                    name: measure.name || '',
                    unitType: measure.meter_unit_id || '',
                    min: measure.min_value || '',
                    max: measure.max_value || '',
                    alertBelowVal: measure.alert_below || '',
                    alertAboveVal: measure.alert_above || '',
                    multiplierFactor: measure.multiplier_factor || '',
                    checkPreviousReading: measure.check_previous_reading || false,
                })));
            }

            // Load existing attachments
            const loadedAttachments = { ...attachments };

            // Asset Image
            if (asset.asset_image) {
                loadedAttachments.meterAssetImage = [{
                    id: asset.asset_image.id || Date.now(),
                    name: asset.asset_image.document_name,
                    url: asset.asset_image.document,
                    isExisting: true
                }];
            }

            // Asset Manuals
            if (asset.asset_manuals && asset.asset_manuals.length > 0) {
                loadedAttachments.meterManualsUpload = asset.asset_manuals.map(manual => ({
                    id: manual.id,
                    name: manual.document_name,
                    url: manual.document,
                    isExisting: true
                }));
            }

            // Asset Insurances
            if (asset.asset_insurances && asset.asset_insurances.length > 0) {
                loadedAttachments.meterInsuranceDetails = asset.asset_insurances.map(insurance => ({
                    id: insurance.id,
                    name: insurance.document_name,
                    url: insurance.document,
                    isExisting: true
                }));
            }

            // Asset Purchases
            if (asset.asset_purchases && asset.asset_purchases.length > 0) {
                loadedAttachments.meterPurchaseInvoice = asset.asset_purchases.map(purchase => ({
                    id: purchase.id,
                    name: purchase.document_name,
                    url: purchase.document,
                    isExisting: true
                }));
            }

            // Asset Other Uploads
            if (asset.asset_other_uploads && asset.asset_other_uploads.length > 0) {
                loadedAttachments.meterOtherDocuments = asset.asset_other_uploads.map(other => ({
                    id: other.id,
                    name: other.document_name,
                    url: other.document,
                    isExisting: true
                }));
            }

            setAttachments(loadedAttachments);
            setInitialDataLoaded(true);
        } catch (error) {
            console.error('Error fetching asset:', error);
            toast({
                title: "Error Loading Asset",
                description: "Failed to load asset data. Please try again.",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch parent meters function
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

    // Fetch Sites
    const fetchSites = async () => {
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
        }
        setLoadingStates((prev) => ({ ...prev, sites: true }));
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
            setLoadingStates((prev) => ({ ...prev, sites: false }));
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
        setLoadingStates((prev) => ({ ...prev, buildings: true }));
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
            setLoadingStates((prev) => ({ ...prev, buildings: false }));
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
        setLoadingStates((prev) => ({ ...prev, wings: true }));
        try {
            const response = await fetch(`${baseUrl}/pms/buildings/${buildingId}/wings.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
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
            setLoadingStates((prev) => ({ ...prev, wings: false }));
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
        setLoadingStates((prev) => ({ ...prev, areas: true }));
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
            setLoadingStates((prev) => ({ ...prev, areas: false }));
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
        setLoadingStates((prev) => ({ ...prev, floors: true }));
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
            setLoadingStates((prev) => ({ ...prev, floors: false }));
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
        setLoadingStates((prev) => ({ ...prev, rooms: true }));
        try {
            const response = await fetch(`${baseUrl}/pms/floors/${floorId}/rooms.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setRooms(data || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms([]);
        } finally {
            setLoadingStates((prev) => ({ ...prev, rooms: false }));
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

    // Fetch meter unit types
    const fetchMeterUnitTypes = async () => {
        let baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';
        if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
        }
        setLoadingUnitTypes(true);
        try {
            const response = await fetch(`${baseUrl}/pms/assets/get_meter_unit_type.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setMeterUnitTypes(data.meter_unit_types || []);
        } catch (error) {
            console.error('Error fetching unit types:', error);
            setMeterUnitTypes([]);
        } finally {
            setLoadingUnitTypes(false);
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

    // Initial data fetch
    useEffect(() => {
        fetchSites();
        fetchGroups();
        fetchMeterUnitTypes();
        fetchAssetData();
    }, [id]);

    // Fetch dependencies when data loads
    useEffect(() => {
        if (initialDataLoaded && formData.site) {
            fetchBuildings(formData.site);
        }
    }, [initialDataLoaded, formData.site]);

    useEffect(() => {
        if (initialDataLoaded && formData.building) {
            fetchWings(formData.building);
        }
    }, [initialDataLoaded, formData.building]);

    useEffect(() => {
        if (initialDataLoaded && formData.wing) {
            fetchAreas(formData.wing);
        }
    }, [initialDataLoaded, formData.wing]);

    useEffect(() => {
        if (initialDataLoaded && formData.area) {
            fetchFloors(formData.area);
        }
    }, [initialDataLoaded, formData.area]);

    useEffect(() => {
        if (initialDataLoaded && formData.floor) {
            fetchRooms(formData.floor);
        }
    }, [initialDataLoaded, formData.floor]);

    useEffect(() => {
        if (initialDataLoaded && formData.group) {
            fetchSubgroups(formData.group);
        }
    }, [initialDataLoaded, formData.group]);

    // Initialize meter category states when data is loaded
    useEffect(() => {
        if (initialDataLoaded && meterCategoryType) {
            handleMeterCategoryChange(meterCategoryType);
            if (subCategoryType) {
                handleSubCategoryChange(subCategoryType);
            }
            if (tertiaryCategory) {
                handleTertiaryCategoryChange(tertiaryCategory);
            }
        }
    }, [initialDataLoaded, meterCategoryType, subCategoryType, tertiaryCategory]);

    // Helper functions from AddAssetPage
    const getMeterCategoryOptions = () => [
        { id: 'board', label: 'Board', icon: BarChart3 },
        { id: 'dg', label: 'DG', icon: Zap },
        { id: 'renewable', label: 'Renewable', icon: Sun },
        { id: 'fresh-water', label: 'Fresh Water', icon: Droplet },
        { id: 'recycled', label: 'Recycled', icon: Recycle },
        { id: 'water-distribution', label: 'Water Distribution', icon: Building },
        { id: 'iex-gdam', label: 'IEX-GDAM', icon: BarChart },
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

    // Fetch parent meters when Sub Meter is selected
    useEffect(() => {
        if (meterType === "SubMeter") {
            fetchParentMeters();
        } else {
            setSelectedParentMeterId("");
        }
    }, [meterType]);

    // Helper: Check if any new files are present in attachments (File objects)
    const hasFiles = () => {
        return Object.values(attachments).some((arr) =>
            Array.isArray(arr) && arr.some((file: any) => file instanceof File)
        );
    };

    // Helper: Build category-specific attachments for payload
    const getCategoryAttachments = () => {
        if (!selectedAssetCategory) return {};
        const categoryKey = selectedAssetCategory.toLowerCase().replace(/\s+/g, '').replace('&', '');
        return {
            asset_image: attachments[`${categoryKey}AssetImage`] || [],
            asset_manuals: attachments[`${categoryKey}ManualsUpload`] || [],
            asset_insurances: attachments[`${categoryKey}InsuranceDetails`] || [],
            asset_purchases: attachments[`${categoryKey}PurchaseInvoice`] || [],
            asset_other_uploads: attachments[`${categoryKey}OtherDocuments`] || [],
        };
    };

    // Main Update Asset handler
    const handleUpdateAsset = async () => {
        if (!id) return;

        setLoading(true);

        // Build payload for update (match AddWaterAssetDashboard structure)
        const payload = {
            pms_asset: {
                name: formData.assetName,
                asset_number: formData.assetNo,
                equipment_id: formData.equipmentId,
                model_number: formData.modelNo,
                serial_number: formData.serialNo,
                consumer_number: formData.consumerNo,
                manufacturer: formData.manufacturer,
                status: formData.status === 'inUse' ? 'in_use' : formData.status,
                critical: formData.critical === 'yes',
                is_meter: formData.meterApplicable,
                meter_applicable: formData.meterApplicable,
                location_type: formData.locationType,
                asset_type: formData.assetType,
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
                expiry_date: formData.expiryDate,
                warranty_expiry: formData.warrantyExpiresOn,
                warranty_start_date: formData.warrantyStartDate,
                warranty_status: formData.warrantyStatus,
                under_warranty: formData.warrantyStatus === 'active',
                purchase_cost: formData.purchaseCost,
                capacity: formData.capacity,
                unit: formData.unit,
                type: assetType,
                meter_tag_type: meterCategoryType,
                sub_category_type: subCategoryType,
                tertiary_category: tertiaryCategory,
                meter_type: meterType,
                parent_meter_id: meterType === 'SubMeter' ? selectedParentMeterId : null,
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
                // Add attachment fields when implemented
                // ...getCategoryAttachments(),
            },
        };

        try {
            let response;

            // Check if file uploads exist for multipart form
            if (hasFiles()) {
                const formDataObj = new FormData();

                // Add all form data fields
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

                // Add measure fields
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

                // Handle attachments - only add new files (File objects)
                Object.entries(attachments).forEach(([category, fileList]) => {
                    if (Array.isArray(fileList)) {
                        fileList.forEach((file: any) => {
                            if (file instanceof File) {
                                // Map categories to API expected names
                                let apiCategory = '';
                                if (category === 'meterAssetImage') apiCategory = 'asset_image';
                                else if (category === 'meterManualsUpload') apiCategory = 'asset_manuals';
                                else if (category === 'meterInsuranceDetails') apiCategory = 'asset_insurances';
                                else if (category === 'meterPurchaseInvoice') apiCategory = 'asset_purchases';
                                else if (category === 'meterOtherDocuments') apiCategory = 'asset_other_uploads';

                                if (apiCategory) {
                                    formDataObj.append(`pms_asset[${apiCategory}][]`, file);
                                }
                            }
                        });
                    }
                });

                response = await apiClient.put(`pms/assets/${id}.json`, formDataObj, {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 300000,
                });
            } else {
                response = await apiClient.put(`pms/assets/${id}.json`, payload, {
                    headers: { "Content-Type": "application/json" },
                });
            }

            toast({
                title: "Asset Updated Successfully",
                description: "The asset has been updated and saved.",
                duration: 3000,
            });

            // Navigate back to appropriate dashboard based on asset type
            if (assetType === 'Energy') {
                navigate('/utility/energy');
            } else {
                navigate('/utility/water');
            }

        } catch (err: any) {
            toast({
                title: "Update Failed",
                description: err?.response?.data?.message || err.message || "An error occurred while updating the asset",
                variant: "destructive",
                duration: 6000,
            });
            console.error("Error updating asset:", err);
        } finally {
            setLoading(false);
        }
    };

    // File upload logic
    const handleFileUpload = async (category: string, files: FileList) => {
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
        const processedFiles: File[] = [];
        let totalSize = 0;

        // Calculate current total size (only count new files, not existing ones)
        Object.values(attachments).forEach((fileList) => {
            if (Array.isArray(fileList)) {
                fileList.forEach((file: any) => {
                    if (file instanceof File) {
                        totalSize += file.size || 0;
                    }
                });
            }
        });

        for (const file of fileArray) {
            if (!allowedTypes.includes(file.type)) {
                continue;
            }
            let processedFile = file;
            if (file.size > maxFileSize) {
                continue;
            }
            if (totalSize + processedFile.size > maxTotalSize) {
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

    // Add, remove, and change handlers for measure fields
    const addMeterMeasureField = (type: 'consumption' | 'nonConsumption') => {
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

    const removeMeterMeasureField = (type: 'consumption' | 'nonConsumption', id: string) => {
        if (type === 'consumption') setConsumptionMeasureFields((prev) => prev.filter((f) => f.id !== id));
        else setNonConsumptionMeasureFields((prev) => prev.filter((f) => f.id !== id));
    };

    const handleMeterMeasureFieldChange = (type: 'consumption' | 'nonConsumption', id: string, field: string, value: string | boolean) => {
        if (type === 'consumption') {
            setConsumptionMeasureFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
        } else {
            setNonConsumptionMeasureFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
        }
    };

    const removeFile = (category: string, index: number) => {
        setAttachments((prev) => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index),
        }));
    };

    // Function to view/download attachment
    const viewAttachment = (attachment: any) => {
        if (attachment.url) {
            window.open(attachment.url, '_blank');
        }
    };

    // Function to get file icon based on type
    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            default:
                return '📁';
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading asset data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    EDIT {assetType === 'Energy' ? 'ENERGY' : 'WATER'} ASSET
                </h1>
            </div>

            <div className="space-y-4">
                {/* Location Details */}
                <Card>
                    <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-gray-50">
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-black">
                                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
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
                                        <FormControl fullWidth size="small" disabled={loadingStates.sites}>
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
                                        <FormControl fullWidth size="small" disabled={loadingStates.buildings || !formData.site}>
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
                                        <FormControl fullWidth size="small" disabled={loadingStates.wings || !formData.building}>
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
                                        <FormControl fullWidth size="small" disabled={loadingStates.areas || !formData.wing}>
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
                                        <FormControl fullWidth size="small" disabled={loadingStates.floors || !formData.area}>
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
                                    <FormControl size="small" sx={{ width: { xs: '100%', md: '20%' } }} disabled={loadingStates.rooms || !formData.floor}>
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
                                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
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
                                            label="Equipment Id"
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
                                            label="Purchase Cost"
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
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                                        />
                                    </div>
                                    <div>
                                        <FormControl fullWidth size="small" disabled={groupsLoading}>
                                            <InputLabel>Group</InputLabel>
                                            <MuiSelect
                                                value={formData.group}
                                                label="Group"
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
                                        <FormControl fullWidth size="small" disabled={subgroupsLoading}>
                                            <InputLabel>Sub Group</InputLabel>
                                            <MuiSelect
                                                value={formData.subgroup}
                                                label="Sub Group"
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
                                            label="Purchased On Date"
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
                                    <div>
                                        <TextField
                                            label="Expiry Date"
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

                                    <div className="flex items-center space-x-2">
                                        <FormControlLabel
                                            control={
                                                <MuiCheckbox
                                                    checked={formData.meterApplicable}
                                                    onChange={(e) => setFormData({ ...formData, meterApplicable: e.target.checked })}
                                                />
                                            }
                                            label="Meter Applicable"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                {/* Purchase & Warranty Details Section */}
                <Card>
                    <Collapsible open={warrantyOpen} onOpenChange={setWarrantyOpen}>
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-gray-50">
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-black">
                                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                        PURCHASE & WARRANTY DETAILS
                                    </span>
                                    {warrantyOpen ? <ChevronUp /> : <ChevronDown />}
                                </CardTitle>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <FormLabel>Warranty Status</FormLabel>
                                        <MuiRadioGroup
                                            value={formData.warrantyStatus}
                                            onChange={(e) => setFormData({ ...formData, warrantyStatus: e.target.value })}
                                            row
                                            sx={{ mt: 1 }}
                                        >
                                            <FormControlLabel value="active" control={<Radio />} label="Active" />
                                            <FormControlLabel value="expired" control={<Radio />} label="Expired" />
                                            <FormControlLabel value="na" control={<Radio />} label="NA" />
                                        </MuiRadioGroup>
                                    </div>

                                    {formData.warrantyStatus === 'active' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    label="Warranty Expiry Date"
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
                                        </div>
                                    )}

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
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                {/* Meter Details Section */}
                {(() => {
                    return (
                        <Card>
                            <Collapsible open={meterOpen} onOpenChange={setMeterOpen}>
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
                                                        checked={formData.meterApplicable}
                                                        onChange={e => setFormData({ ...formData, meterApplicable: e.target.checked })}
                                                    />
                                                    <label
                                                        htmlFor="meter-details-toggle"
                                                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${formData.meterApplicable ? 'bg-green-400' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.meterApplicable ? 'translate-x-6' : 'translate-x-1'}`}></span>
                                                    </label>
                                                </div>
                                                {meterOpen ? <ChevronUp /> : <ChevronDown />}
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent>
                                        <div className={`${!formData.meterApplicable ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {/* Meter Type selection (Parent/Sub) */}
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
                                                                disabled={!formData.meterApplicable}
                                                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                                                style={{ accentColor: '#C72030' }}
                                                            />
                                                            <label htmlFor="meter-type-parent" className={`text-sm ${!formData.meterApplicable ? 'text-gray-400' : ''}`}>Parent</label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                id="meter-type-sub"
                                                                name="meter_tag_type"
                                                                value="SubMeter"
                                                                checked={meterType === 'SubMeter'}
                                                                onChange={e => setMeterType(e.target.value)}
                                                                disabled={!formData.meterApplicable}
                                                                className="w-4 h-4 text-[#C72030] border-gray-300"
                                                                style={{ accentColor: '#C72030' }}
                                                            />
                                                            <label htmlFor="meter-type-sub" className={`text-sm ${!formData.meterApplicable ? 'text-gray-400' : ''}`}>Sub</label>
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
                                                        disabled={parentMeterLoading || !formData.meterApplicable}
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
                                                    {/* Fresh Water only for WaterAsset */}
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

                {/* Attachments Section */}
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
                                    {/* Asset Image Section */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                            Asset Image
                                        </h3>

                                        {/* Existing Images */}
                                        {attachments.meterAssetImage && attachments.meterAssetImage.length > 0 && (
                                            <div className="mb-4">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {attachments.meterAssetImage.map((file: any, index: number) => (
                                                        <div key={index} className="relative group">
                                                            <div className="border rounded-lg p-2 bg-gray-50">
                                                                {file.url && (file.name.toLowerCase().includes('.jpg') ||
                                                                    file.name.toLowerCase().includes('.jpeg') ||
                                                                    file.name.toLowerCase().includes('.png') ||
                                                                    file.name.toLowerCase().includes('.gif')) ? (
                                                                    <img
                                                                        src={file.url}
                                                                        alt={file.name}
                                                                        className="w-full h-20 object-cover rounded cursor-pointer"
                                                                        onClick={() => viewAttachment(file)}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="w-full h-20 flex items-center justify-center bg-gray-200 rounded cursor-pointer"
                                                                        onClick={() => viewAttachment(file)}
                                                                    >
                                                                        <span className="text-2xl">{getFileIcon(file.name)}</span>
                                                                    </div>
                                                                )}
                                                                <p className="text-xs mt-1 truncate" title={file.name}>
                                                                    {file.name}
                                                                </p>
                                                                <div className="flex justify-between mt-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => viewAttachment(file)}
                                                                        className="text-xs text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        View
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeFile('meterAssetImage', index)}
                                                                        className="text-xs text-red-600 hover:text-red-800"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload New Asset Image */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.gif"
                                                onChange={(e) => e.target.files && handleFileUpload('meterAssetImage', e.target.files)}
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
                                                        Add Asset Image
                                                    </span>
                                                </div>
                                            </label>
                                            <div className="mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('asset-image-upload')?.click()}
                                                    className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto"
                                                >
                                                    <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
                                                    Upload Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Sections */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        {[
                                            {
                                                label: "Manuals Upload",
                                                id: "manuals-upload",
                                                accept: ".pdf,.doc,.docx,.txt",
                                                key: "meterManualsUpload"
                                            },
                                            {
                                                label: "Insurance Details",
                                                id: "insurance-upload",
                                                accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                                                key: "meterInsuranceDetails"
                                            },
                                            {
                                                label: "Purchase Invoice",
                                                id: "invoice-upload",
                                                accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                                                key: "meterPurchaseInvoice"
                                            },
                                            {
                                                label: "Other Documents",
                                                id: "other-upload",
                                                accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                                                key: "meterOtherDocuments"
                                            },
                                        ].map((field) => (
                                            <div key={field.id}>
                                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                                                    {field.label}
                                                </label>

                                                {/* Existing Files */}
                                                {attachments[field.key] && attachments[field.key].length > 0 && (
                                                    <div className="mb-4 max-h-40 overflow-y-auto">
                                                        <div className="space-y-2">
                                                            {attachments[field.key].map((file: any, index: number) => (
                                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                                        <span className="text-lg">{getFileIcon(file.name)}</span>
                                                                        <span className="text-xs truncate" title={file.name}>
                                                                            {file.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex space-x-2 ml-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => viewAttachment(file)}
                                                                            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                                                                        >
                                                                            View
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeFile(field.key, index)}
                                                                            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Upload New Files */}
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept={field.accept}
                                                        onChange={(e) => e.target.files && handleFileUpload(field.key, e.target.files)}
                                                        className="hidden"
                                                        id={field.id}
                                                    />
                                                    <label
                                                        htmlFor={field.id}
                                                        className="cursor-pointer block"
                                                    >
                                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                                            <span className="text-[#C72030] font-medium text-xs sm:text-sm">
                                                                Add {field.label}
                                                            </span>
                                                        </div>
                                                    </label>
                                                    <div className="mt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => document.getElementById(field.id)?.click()}
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
                        onClick={() => {
                            if (assetType === 'Energy') {
                                navigate('/utility/energy');
                            } else {
                                navigate('/utility/water');
                            }
                        }}
                        variant="outline"
                        className="px-8"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateAsset}
                        className="bg-purple-700 text-white hover:bg-purple-800 px-8"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Asset'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EditWaterAssetDashboard;
export { EditWaterAssetDashboard };
