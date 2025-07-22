import React, { useState } from 'react';
import { SurveyMappingTable } from '../components/SurveyMappingTable';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Filter, Download, RotateCcw, Search, Eye } from 'lucide-react';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { Switch } from "@/components/ui/switch";
import { QRCodeModal } from '../components/QRCodeModal';

export const SurveyMappingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedQR, setSelectedQR] = useState<{
    qrCode: string;
    serviceName: string;
    site: string;
  } | null>(null);
  
  const [mappings, setMappings] = useState([
    {
      id: 1,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Lockated",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Basement",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR001"
    },
    {
      id: 2,
      serviceId: "12345",
      serviceName: "Survey Title 123", 
      site: "Panchashil",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Third",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR002"
    },
    {
      id: 3,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Lockated",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Basement",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR003"
    },
    {
      id: 4,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Panchashil",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "First",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR004"
    },
    {
      id: 5,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Panchashil",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Basement",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR005"
    },
    {
      id: 6,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Lockated",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Second",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR006"
    },
    {
      id: 7,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Lockated",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Basement",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR007"
    },
    {
      id: 8,
      serviceId: "12345",
      serviceName: "Survey Title 123",
      site: "Panchashil",
      building: "Tower A",
      wing: "Wing A",
      area: "Area A",
      floor: "Third",
      room: "EV Room",
      status: true,
      createdOn: "01/07/2025",
      qrCode: "QR008"
    },
    {
      id: 9,
      serviceId: "12346",
      serviceName: "Customer Satisfaction Survey",
      site: "TechPark",
      building: "Tower B",
      wing: "Wing B",
      area: "Area B",
      floor: "Fourth",
      room: "Conference Room",
      status: false,
      createdOn: "02/07/2025",
      qrCode: "QR009"
    },
    {
      id: 10,
      serviceId: "12347",
      serviceName: "Employee Feedback Survey", 
      site: "Corporate",
      building: "Main Building",
      wing: "East Wing",
      area: "HR Area",
      floor: "Fifth",
      room: "Meeting Room 1",
      status: true,
      createdOn: "03/07/2025",
      qrCode: "QR010"
    },
    {
      id: 11,
      serviceId: "12348",
      serviceName: "Product Quality Assessment",
      site: "Manufacturing",
      building: "Factory A",
      wing: "Production Wing",
      area: "QC Area",
      floor: "Ground",
      room: "Lab 1",
      status: true,
      createdOn: "04/07/2025",
      qrCode: "QR011"
    },
    {
      id: 12,
      serviceId: "12349",
      serviceName: "Service Quality Survey",
      site: "ServiceCenter",
      building: "Support Building",
      wing: "Customer Wing",
      area: "Service Area",
      floor: "Second",
      room: "Help Desk",
      status: false,
      createdOn: "05/07/2025",
      qrCode: "QR012"
    },
    {
      id: 13,
      serviceId: "12350",
      serviceName: "Market Research Survey",
      site: "Research Hub",
      building: "Innovation Center",
      wing: "Research Wing",
      area: "Analytics Area",
      floor: "Sixth",
      room: "Data Room",
      status: true,
      createdOn: "06/07/2025",
      qrCode: "QR013"
    },
    {
      id: 14,
      serviceId: "12351",
      serviceName: "Training Effectiveness Survey",
      site: "Training Center",
      building: "Education Building",
      wing: "Learning Wing",
      area: "Training Area",
      floor: "Third",
      room: "Classroom A",
      status: true,
      createdOn: "07/07/2025",
      qrCode: "QR014"
    },
    {
      id: 15,
      serviceId: "12352",
      serviceName: "Event Feedback Survey",
      site: "Event Hall",
      building: "Convention Center",
      wing: "Main Wing",
      area: "Event Area",
      floor: "Ground",
      room: "Auditorium",
      status: false,
      createdOn: "08/07/2025",
      qrCode: "QR015"
    }
  ]);

  const handleStatusToggle = (item: any) => {
    setMappings(prev => prev.map(mapping => 
      mapping.id === item.id 
        ? { ...mapping, status: !mapping.status }
        : mapping
    ));
  };

  const handleQRClick = (mapping: any) => {
    setSelectedQR({
      qrCode: mapping.qrCode,
      serviceName: mapping.serviceName,
      site: mapping.site
    });
  };

  const handleViewClick = (item: any) => {
    console.log('View clicked for item:', item.id);
  };

  const columns = [
    { key: 'serviceId', label: 'ID', sortable: true, draggable: true },
    { key: 'serviceName', label: 'Service Name', sortable: true, draggable: true },
    { key: 'site', label: 'Site', sortable: true, draggable: true },
    { key: 'building', label: 'Building', sortable: true, draggable: true },
    { key: 'wing', label: 'Wing', sortable: true, draggable: true },
    { key: 'area', label: 'Area', sortable: true, draggable: true },
    { key: 'floor', label: 'Floor', sortable: true, draggable: true },
    { key: 'room', label: 'Room', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: false, draggable: true },
    { key: 'createdOn', label: 'Created On', sortable: true, draggable: true },
    { key: 'qrCode', label: 'QR', sortable: false, draggable: true }
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return (
          <Switch
            checked={item.status}
            onCheckedChange={() => handleStatusToggle(item)}
          />
        );
      case 'qrCode':
        return (
          <button 
            onClick={() => handleQRClick(item)}
            className="w-8 h-8 bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 bg-white grid grid-cols-3 gap-px">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-black" style={{ 
                  backgroundColor: Math.random() > 0.5 ? 'black' : 'white' 
                }}></div>
              ))}
            </div>
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const renderActions = (item: any) => (
    <button 
      onClick={() => handleViewClick(item)}
      className="text-gray-600 hover:text-gray-800"
    >
      <Eye className="w-4 h-4" />
    </button>
  );

  // Filter mappings based on search term
  const filteredMappings = mappings.filter(mapping =>
    mapping.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.wing.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <p className="text-muted-foreground text-sm mb-2">
            Survey &gt; Mapping
          </p>
          <Heading level="h1" variant="default">Mapping List</Heading>
        </div>
      </div>
      
      {/* Action Buttons Row - Responsive */}

      {/* Enhanced Survey Mapping Table */}
      <div>
        <EnhancedTable
          data={filteredMappings}
          columns={columns}
          selectable={true}
          renderActions={renderActions}
          renderCell={renderCell}
          storageKey="survey-mapping-table"
          enableExport={true}
          exportFileName="survey-mapping-data"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search mappings..."
          pagination={true}
          pageSize={10}
          leftActions={
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Button className="flex items-center gap-2 bg-[#F2EEE9] text-[#BF213E] border-0 hover:bg-[#F2EEE9]/80">
                <Plus className="w-4 h-4" />
                Add
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
                <span className="hidden sm:inline">Print QR</span>
              </Button>
            </div>
          }
        />
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={!!selectedQR}
        onClose={() => setSelectedQR(null)}
        qrCode={selectedQR?.qrCode || ''}
        serviceName={selectedQR?.serviceName || ''}
        site={selectedQR?.site || ''}
      />
    </div>
  );
};
