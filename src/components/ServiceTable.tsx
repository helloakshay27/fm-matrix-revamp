
import React, { useState } from 'react';
import { Eye, Filter, Plus, Import, QrCode, RotateCcw } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5DbDB]">
      {/* Table Header Actions */}
      <div className="p-6 border-b border-[#D5DbDB]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
            <button className="px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
              🔍
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f6f4ee]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedServices.length === filteredServices.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-[#D5DbDB] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                View
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Reference Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Service Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Uom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Wing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Floor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Created on
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D5DbDB]">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={(e) => handleSelectService(service.id, e.target.checked)}
                    className="rounded border-[#D5DbDB] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-[#1a1a1a] hover:text-[#8B5CF6] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a1a1a]">
                  {service.serviceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.referenceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.referenceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.group}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a] font-mono">
                  {service.serviceCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.uom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.site}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.building}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.wing}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusToggle(service.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {service.createdOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#D5DbDB] flex justify-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
