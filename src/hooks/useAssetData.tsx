
import { useState, useMemo } from 'react';

const assetData = [
  {
    id: '203696',
    name: 'Dell Laptop Pro',
    code: '026d4956a50be20318za',
    assetNo: 'DL-001',
    status: 'In Use',
    equipmentId: 'EQ-LT-001',
    site: 'Main Campus',
    building: 'Building A',
    wing: 'East Wing',
    floor: '3rd Floor',
    area: 'IT Department',
    room: 'Room 301',
    meterType: 'Power Meter',
    assetType: 'IT Equipment',
    serialNumber: 'DL2024001',
    group: 'Electronics',
    subGroup: 'Computers'
  },
  {
    id: '203694',
    name: 'HP Printer Scanner',
    code: '5e298bffcab011bb6e16',
    assetNo: 'HP-002',
    status: 'Breakdown',
    equipmentId: 'EQ-PR-002',
    site: 'Main Campus',
    building: 'Building B',
    wing: 'West Wing',
    floor: '2nd Floor',
    area: 'Admin Office',
    room: 'Room 205',
    meterType: 'Usage Meter',
    assetType: 'Office Equipment',
    serialNumber: 'HP2024002',
    group: 'Office',
    subGroup: 'Printers'
  },
  {
    id: '203695',
    name: 'Air Conditioning Unit',
    code: '7f456abc789def123456',
    assetNo: 'AC-003',
    status: 'In Use',
    equipmentId: 'EQ-AC-003',
    site: 'Branch Office',
    building: 'Building C',
    wing: 'North Wing',
    floor: '1st Floor',
    area: 'Reception',
    room: 'Lobby',
    meterType: 'Energy Meter',
    assetType: 'HVAC Equipment',
    serialNumber: 'AC2024003',
    group: 'HVAC',
    subGroup: 'Cooling'
  },
  {
    id: '203697',
    name: 'Security Camera System',
    code: '9e123def456ghi789abc',
    assetNo: 'SC-004',
    status: 'In Use',
    equipmentId: 'EQ-SC-004',
    site: 'Main Campus',
    building: 'Building A',
    wing: 'Central',
    floor: 'All Floors',
    area: 'Security',
    room: 'Multiple',
    meterType: 'Network Meter',
    assetType: 'Security Equipment',
    serialNumber: 'SC2024004',
    group: 'Security',
    subGroup: 'Surveillance'
  },
  {
    id: '203698',
    name: 'Conference Room Projector',
    code: '4a789bcd012efg345hij',
    assetNo: 'PR-005',
    status: 'Maintenance',
    equipmentId: 'EQ-PJ-005',
    site: 'Main Campus',
    building: 'Building B',
    wing: 'South Wing',
    floor: '4th Floor',
    area: 'Conference Area',
    room: 'Conference Room A',
    meterType: 'Usage Meter',
    assetType: 'AV Equipment',
    serialNumber: 'PR2024005',
    group: 'AV',
    subGroup: 'Display'
  }
];

export const useAssetData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assetData);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const stats = useMemo(() => {
    const totalAssets = assetData.length;
    const inUseAssets = assetData.filter(asset => asset.status === 'In Use').length;
    const breakdownAssets = assetData.filter(asset => asset.status === 'Breakdown').length;
    const maintenanceAssets = assetData.filter(asset => asset.status === 'Maintenance').length;
    const standbyAssets = assetData.filter(asset => asset.status === 'Standby').length;
    const itAssets = assetData.filter(asset => asset.assetType.includes('IT') || asset.assetType.includes('Network')).length;
    const nonItAssets = totalAssets - itAssets;
    const totalValue = 125000;
    const inStoreAssets = 0;
    const disposeAssets = 0;
    
    return {
      total: totalAssets,
      inUse: inUseAssets,
      breakdown: breakdownAssets + maintenanceAssets + standbyAssets,
      totalValue: totalValue,
      nonItAssets: nonItAssets,
      itAssets: itAssets,
      inStore: inStoreAssets,
      dispose: disposeAssets,
      maintenance: maintenanceAssets,
      standby: standbyAssets
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = assetData.filter(asset =>
        asset.name.toLowerCase().includes(value.toLowerCase()) ||
        asset.code.toLowerCase().includes(value.toLowerCase()) ||
        asset.assetNo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assetData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  return {
    assetData,
    filteredAssets,
    selectedAssets,
    searchTerm,
    stats,
    handleSearch,
    handleSelectAll,
    handleSelectAsset
  };
};
