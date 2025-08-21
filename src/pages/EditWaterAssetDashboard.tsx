import React, { useState, useEffect } from 'react';
import {
    Activity, BarChart3, Zap, Sun, Droplet, Recycle, BarChart, Plug, Frown, Wind, ArrowDown, ArrowUp, Plus, X, ChevronUp, ChevronDown, Building
} from 'lucide-react';
import { MeterMeasureFields } from '@/components/asset/MeterMeasureFields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
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

function EditWaterAssetDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

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
    const [meterOpen, setMeterOpen] = useState(true);
    const [attributesOpen, setAttributesOpen] = useState(true);
    const [purchaseOpen, setPurchaseOpen] = useState(true);
    const [warrantyOpen, setWarrantyOpen] = useState(true);
    const [measureOpen, setMeasureOpen] = useState(true);
    const [uploadsOpen, setUploadsOpen] = useState(true);

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
                purchaseCost: asset.purchase_cost || '',
                capacity: asset.capacity || '',
                unit: asset.unit || '',
                group: asset.pms_asset_group_id || '',
                subgroup: asset.pms_asset_sub_group_id || '',
                purchasedOnDate: asset.purchased_on || '',
                expiryDate: asset.expiry_date || '',
                manufacturer: asset.manufacturer || '',
                locationType: asset.location_type || 'common',
                assetType: asset.asset_type || 'parent',
                status: asset.status === 'in_use' ? 'inUse' : asset.status || 'inUse',
                critical: asset.critical ? 'yes' : 'no',
                meterApplicable: asset.meter_applicable || false,
                underWarranty: asset.under_warranty ? 'yes' : 'no',
                warrantyStartDate: asset.warranty_start_date || '',
                warrantyExpiresOn: asset.warranty_expiry || '',
                commissioningDate: asset.commisioning_date || '',
                selectedMeterCategories: asset.selected_meter_categories || [],
                selectedMeterCategory: asset.meter_tag_type || '',
                boardSubCategory: asset.board_sub_category || '',
                renewableSubCategory: asset.renewable_sub_category || '',
                freshWaterSubCategory: asset.fresh_water_sub_category || '',
            });

            // Set meter-related states
            setMeterCategoryType(asset.meter_tag_type || '');
            setSubCategoryType(asset.sub_category_type || '');
            setTertiaryCategory(asset.tertiary_category || '');
            setMeterType(asset.meter_type || '');
            setSelectedParentMeterId(asset.parent_meter_id || '');

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

    // Fetch parent meters when Sub Meter is selected
    useEffect(() => {
        if (meterType === "SubMeter") {
            fetchParentMeters();
        } else {
            setSelectedParentMeterId("");
        }
    }, [meterType]);

    // Helper: Check if any files are present in attachments
    const hasFiles = () => {
        return Object.values(attachments).some((arr) => Array.isArray(arr) && arr.length > 0);
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

        // Build payload for update (map your formData fields to API keys)
        const payload = {
            pms_asset: {
                name: formData.assetName,
                asset_number: formData.assetNo,
                model_number: formData.modelNo,
                serial_number: formData.serialNo,
                manufacturer: formData.manufacturer,
                status: formData.status === 'inUse' ? 'in_use' : formData.status,
                critical: formData.critical === 'yes' || formData.critical === 'true',
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
                Object.entries(attachments).forEach(([key, arr]) => {
                    if (Array.isArray(arr)) {
                        arr.forEach((file) => {
                            formDataObj.append(`pms_asset[${key}][]`, file);
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

            // Navigate back to water assets list
            navigate('/utility/water');
        } catch (err) {
            toast({
                title: "Update Failed",
                description: err?.response?.data?.message || err.message || "An error occurred while updating the asset",
                duration: 6000,
            });
            console.error("Error updating asset:", err);
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

        // Calculate current total size
        Object.values(attachments).forEach((fileList) => {
            if (Array.isArray(fileList)) {
                fileList.forEach((file: File) => {
                    totalSize += file.size || 0;
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
                <h1 className="text-2xl font-bold text-gray-900">EDIT WATER ASSET</h1>
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
                                            label="Model No.*"
                                            placeholder="Enter Text"
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
                                            label="Serial No.*"
                                            placeholder="Enter Text"
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
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                {/* Meter Details Section */}
                <Card>
                    <Collapsible open={meterOpen} onOpenChange={setMeterOpen}>
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-gray-50">
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-black">
                                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                        METER DETAILS
                                    </span>
                                    {meterOpen ? <ChevronUp /> : <ChevronDown />}
                                </CardTitle>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Meter Type Selection */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Meter Type</InputLabel>
                                                <MuiSelect
                                                    value={meterType}
                                                    label="Meter Type"
                                                    onChange={(e) => setMeterType(e.target.value)}
                                                    sx={{ height: '45px' }}
                                                >
                                                    <MenuItem value="ParentMeter">Parent Meter</MenuItem>
                                                    <MenuItem value="SubMeter">Sub Meter</MenuItem>
                                                </MuiSelect>
                                            </FormControl>
                                        </div>
                                        {meterType === "SubMeter" && (
                                            <div>
                                                <FormControl fullWidth size="small" disabled={parentMeterLoading}>
                                                    <InputLabel>Parent Meter</InputLabel>
                                                    <MuiSelect
                                                        value={selectedParentMeterId}
                                                        label="Parent Meter"
                                                        onChange={(e) => setSelectedParentMeterId(e.target.value)}
                                                        sx={{ height: '45px' }}
                                                    >
                                                        {parentMeters.map((meter) => (
                                                            <MenuItem key={meter.id} value={meter.id}>
                                                                {meter.name}
                                                            </MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                </FormControl>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meter Measure Fields - Show based on meter type selection */}
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

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => navigate('/utility/water')}
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
