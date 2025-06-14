
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, RotateCcw } from "lucide-react";

export const DesignInsightsDashboard = () => {
  const designInsightsData = [
    {
      id: '#372',
      date: '24/03/2025',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Sony Bhosle',
      location: 'pune',
      observation: 'test',
      recommendation: 'test',
      category: 'Landscape',
      subCategory: '',
      categorization: 'Safety',
      tag: 'Workaround'
    },
    {
      id: '#369',
      date: '11/05/2024',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Robert Day2',
      location: '',
      observation: 'sss',
      recommendation: 'aa',
      category: 'Façade',
      subCategory: '',
      categorization: '',
      tag: ''
    },
    {
      id: '#231',
      date: '06/07/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'sanket Patil',
      location: 'Basement',
      observation: 'Clean the water',
      recommendation: 'Mark',
      category: 'Façade',
      subCategory: '',
      categorization: 'Workaround',
      tag: ''
    },
    {
      id: '#204',
      date: '18/04/2023',
      site: 'Godrej Prime,Gurgaon',
      zone: 'NCR',
      createdBy: 'Robert Day2',
      location: 'Location Demo 123',
      observation: 'Demo',
      recommendation: 'Demo',
      category: 'Security & surveillance',
      subCategory: 'Access Control',
      categorization: '',
      tag: ''
    },
    {
      id: '#203',
      date: '18/04/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Devesh Jain',
      location: 'Sndksksk',
      observation: 'Dndndjjd',
      recommendation: 'Dndjdkkd',
      category: 'Security & surveillance',
      subCategory: 'CCTV',
      categorization: '',
      tag: ''
    },
    {
      id: '#202',
      date: '18/04/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Devesh Jain',
      location: 'Jejensn',
      observation: 'Nsnsejejr',
      recommendation: 'Ndsjeiejnd',
      category: 'Inside Units',
      subCategory: 'Bedroom',
      categorization: '',
      tag: ''
    },
    {
      id: '#201',
      date: '18/04/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Devesh Jain',
      location: 'Snsjs',
      observation: 'Dndjdjd',
      recommendation: 'Rnerir',
      category: 'Security & surveillance',
      subCategory: 'Entry-Exit',
      categorization: '',
      tag: ''
    },
    {
      id: '#200',
      date: '18/04/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Devesh Jain',
      location: 'Rjdkei',
      observation: 'Endnen',
      recommendation: 'Dnekek',
      category: 'Inside Units',
      subCategory: 'Bedroom',
      categorization: '',
      tag: ''
    }
  ];

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insights > Design Insights List</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">DESIGN INSIGHTS</h1>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            <Download className="w-4 h-4 mr-2" />
            Download Report With Picture
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            <Download className="w-4 h-4 mr-2" />
            Download Report Without Picture
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-purple-700 text-white hover:bg-purple-800">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Site</TableHead>
              <TableHead className="font-semibold">Zone</TableHead>
              <TableHead className="font-semibold">Created by</TableHead>
              <TableHead className="font-semibold">location</TableHead>
              <TableHead className="font-semibold">Observation</TableHead>
              <TableHead className="font-semibold">Recommendation</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Sub category</TableHead>
              <TableHead className="font-semibold">Categorization</TableHead>
              <TableHead className="font-semibold">Tag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {designInsightsData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.site}</TableCell>
                <TableCell>{item.zone}</TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.observation}</TableCell>
                <TableCell>{item.recommendation}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.subCategory}</TableCell>
                <TableCell>{item.categorization}</TableCell>
                <TableCell>{item.tag}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DesignInsightsDashboard;
