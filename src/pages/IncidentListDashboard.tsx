
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Plus, Search } from "lucide-react";

const IncidentListDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const incidents = [
    {
      id: '#1870',
      description: 'ygyuiyi',
      site: 'Lockated',
      region: '',
      tower: 'Jyoti Tower',
      incidentTime: '29/01/2025 3:21 PM',
      level: 'Level 3',
      category: 'Risk Assessment',
      subCategory: 'Access Control',
      supportRequired: 'Yes',
      assignedTo: '',
      currentStatus: 'Open'
    },
    {
      id: '#1869',
      description: 'ygyuiyi',
      site: 'Lockated',
      region: '',
      tower: 'Jyoti Tower',
      incidentTime: '29/01/2025 3:21 PM',
      level: 'Level 3',
      category: 'Risk Assessment',
      subCategory: 'Access Control',
      supportRequired: 'Yes',
      assignedTo: '',
      currentStatus: 'Open'
    },
    {
      id: '#1328',
      description: 'HRMS integration with vodafoneldea client has broken due to directory access issue at SFTP side',
      site: 'Lockated',
      region: '',
      tower: 'Gophygital',
      incidentTime: '20/08/2024 3:39 PM',
      level: 'Level 3',
      category: 'Risk Assessment',
      subCategory: 'Integration Failure',
      supportRequired: 'Yes',
      assignedTo: '',
      currentStatus: 'Closed'
    }
  ];

  const filteredIncidents = incidents.filter(incident =>
    incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          Incidents &gt; Incidents List
        </div>
        <h1 className="text-2xl font-bold text-gray-900">INCIDENTS LIST</h1>
      </div>

      <Card className="bg-white">
        <CardContent className="p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search using Incident Id"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                Go!
              </Button>
              <Button variant="outline" className="px-8">
                Reset
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Site</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Region</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tower</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Incident Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Level</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Sub Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Support Required</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Current Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-medium">{incident.id}</td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{incident.description}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.site}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.region}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.tower}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.incidentTime}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.level}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.category}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.subCategory}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.supportRequired}</td>
                    <td className="py-3 px-4 text-gray-700">{incident.assignedTo}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        incident.currentStatus === 'Open' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {incident.currentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentListDashboard;
