
import React, { useState } from 'react';
import { Eye, Filter, Plus, Import, QrCode, RotateCcw } from 'lucide-react';
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

const services = [
  {
    id: 1,
    serviceName: 'Mock Office area',
    referenceNumber: '15200',
    serviceCode: '3fd1ff4f456cab687f80',
    category: '',
    group: '',
    uom: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    area: 'Passage C',
    floor: '3rd Floor',
    room: '',
    status: true,
    createdOn: '25/09/2024'
  },
  {
    id: 2,
    serviceName: 'Office area',
    referenceNumber: '15199',
    serviceCode: '4c7124b629eb52a3957e',
    category: '',
    group: '',
    uom: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    area: '',
    floor: '',
    room: '',
    status: true,
    createdOn: '25/09/2024'
  },
  {
    id: 3,
    serviceName: 'VIP Area',
    referenceNumber: '15121',
    serviceCode: 'aa3db6efb71c29908472',
    category: '',
    group: '',
    uom: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    area: 'Common Area',
    floor: '3rd Floor',
    room: '',
    status: true,
    createdOn: '28/08/2024'
  },
  {
    id: 4,
    serviceName: 'VIP Area Office',
    referenceNumber: '15097',
    serviceCode: '13984d70e15da42d7815',
    category: '',
    group: '',
    uom: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    area: 'VIP Area',
    floor: '3rd Floor',
    room: "Landlord's Office",
    status: true,
    createdOn: '23/08/2024'
  },
  {
    id: 5,
    serviceName: 'Xenvolt',
    referenceNumber: '14945',
    serviceCode: 'df3d9005fd9fc73f06cc',
    category: '',
    group: '',
    uom: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    area: 'Passage A',
    floor: '3rd Floor',
    room: '',
    status: true,
    createdOn: '12/07/2024'
  }
];

interface ServiceTableProps {
  onAddService: () => void;
}

const columns: ColumnConfig[] = [
  { key: 'serviceName', label: 'Service Name', sortable: true, hideable: true, draggable: true },
  { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
  { key: 'referenceNumber', label: 'Reference Number', sortable: true, hideable: true, draggable: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
  { key: 'group', label: 'Group', sortable: true, hideable: true, draggable: true },
  { key: 'serviceCode', label: 'Service Code', sortable: true, hideable: true, draggable: true },
  { key: 'uom', label: 'UOM', sortable: true, hideable: true, draggable: true },
  { key: 'site', label: 'Site', sortable: true, hideable: true, draggable: true },
  { key: 'building', label: 'Building', sortable: true, hideable: true, draggable: true },
  { key: 'wing', label: 'Wing', sortable: true, hideable: true, draggable: true },
  { key: 'area', label: 'Area', sortable: true, hideable: true, draggable: true },
  { key: 'floor', label: 'Floor', sortable: true, hideable: true, draggable: true },
  { key: 'room', label: 'Room', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, draggable: true },
  { key: 'actions', label: 'View', sortable: false, hideable: false, draggable: false }
];

export const ServiceTable = ({ onAddService }: ServiceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(filteredServices.map(service => service.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleSelectService = (serviceId: number, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  const getStatusToggle = (status: boolean) => {
    return (
      <div className="flex items-center">
        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          status ? 'bg-green-500' : 'bg-gray-300'
        }`}>
          <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            status ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </div>
      </div>
    );
  };

  const renderRow = (item: any) => ({
    serviceName: item.serviceName,
    id: item.referenceNumber,
    referenceNumber: item.referenceNumber,
    category: item.category,
    group: item.group,
    serviceCode: item.serviceCode,
    uom: item.uom,
    site: item.site,
    building: item.building,
    wing: item.wing,
    area: item.area,
    floor: item.floor,
    room: item.room,
    status: getStatusToggle(item.status),
    createdOn: item.createdOn,
    actions: (
      <button className="text-[#1a1a1a] hover:text-[#8B5CF6] transition-colors">
        <Eye className="w-4 h-4" />
      </button>
    )
  });

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onAddService}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Import className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Import className="w-4 h-4" />
            Import Locations
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <QrCode className="w-4 h-4" />
            Print QR
          </button>
        </div>
      </div>

      <EnhancedTable
        data={filteredServices}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={true}
        enableExport={true}
        storageKey="service-table"
      />
    </div>
  );
};
