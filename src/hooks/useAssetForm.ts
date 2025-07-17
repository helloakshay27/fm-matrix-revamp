
import { useState } from 'react';

export const useAssetForm = () => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    warranty: true,
    meterCategory: true,
    consumption: true,
    nonConsumption: true,
    assetAllocation: true,
    assetLoaned: true,
    amcDetails: true,
    attachments: true
  });

  const [locationData, setLocationData] = useState({
    site: 'Lockated',
    building: 'sebc',
    wing: '',
    area: '',
    floor: '',
    room: ''
  });

  const [formData, setFormData] = useState({
    assetName: 'sdcsdc',
    assetNo: 'sdcsdc',
    equipmentId: '',
    modelNo: 'tested',
    serialNo: 'sdcsdc',
    consumerNo: '',
    purchaseCost: '0.0',
    capacity: '10',
    unit: '10',
    group: 'Electrical',
    subgroup: 'Electric Meter',
    purchaseDate: '2024-05-26',
    expiryDate: '',
    manufacturer: '',
    vendor: '',
    locationType: 'common-area',
    assetType: 'parent',
    status: 'in-use',
    critical: 'yes',
    meterApplicable: true,
    underWarranty: 'yes',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: ''
  });

  const [itAssetData, setItAssetData] = useState({
    os: '',
    totalMemory: '',
    processor: '',
    model: '',
    serialNo: '',
    capacity: ''
  });

  const [hardDiskHeading, setHardDiskHeading] = useState('HARD DISK DETAILS');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItAssetChange = (field: string, value: string) => {
    setItAssetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHardDiskHeadingChange = (newHeading: string) => {
    setHardDiskHeading(newHeading);
  };

  return {
    expandedSections,
    locationData,
    formData,
    itAssetData,
    hardDiskHeading,
    toggleSection,
    handleLocationChange,
    handleInputChange,
    handleItAssetChange,
    handleHardDiskHeadingChange
  };
};
