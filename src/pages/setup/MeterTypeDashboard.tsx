
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit } from 'lucide-react';

const meterTypes = [
  {
    id: 1,
    meterCategory: 'Electric Meter',
    unitName: 'KW, kwh',
    meterType: 'Energy',
    status: true
  },
  {
    id: 2,
    meterCategory: 'Flow Meter',
    unitName: 'LPH, Liter per hours',
    meterType: 'Energy',
    status: true
  },
  {
    id: 3,
    meterCategory: 'Energy Meter',
    unitName: 'kWh',
    meterType: 'Energy',
    status: true
  },
  {
    id: 4,
    meterCategory: 'Ammeter',
    unitName: 'Amps',
    meterType: 'Energy',
    status: true
  },
  {
    id: 5,
    meterCategory: 'Voltmeter',
    unitName: 'V',
    meterType: 'Energy',
    status: true
  },
  {
    id: 6,
    meterCategory: 'galvanometer',
    unitName: 'Voltage',
    meterType: 'Energy',
    status: true
  },
  {
    id: 7,
    meterCategory: 'Diesel Generator',
    unitName: 'Voltage, Kwh, Litres, Hours',
    meterType: 'Energy',
    status: true
  },
  {
    id: 8,
    meterCategory: 'cre',
    unitName: 'kwh, ltr, hrs, hz',
    meterType: 'Energy',
    status: true
  },
  {
    id: 9,
    meterCategory: 'DG',
    unitName: 'VOLT',
    meterType: 'Energy',
    status: false
  },
  {
    id: 10,
    meterCategory: 'DG',
    unitName: 'Kwh, volt',
    meterType: 'Energy',
    status: false
  },
  {
    id: 11,
    meterCategory: 'Fire Meter',
    unitName: 'volt, amp',
    meterType: 'Energy',
    status: true
  },
  {
    id: 12,
    meterCategory: 'DG 0',
    unitName: 'Hours, KWH, temperature, Voltage',
    meterType: 'Energy',
    status: true
  },
  {
    id: 13,
    meterCategory: 'Electric meter - 1',
    unitName: 'Unit',
    meterType: 'Energy',
    status: true
  },
  {
    id: 14,
    meterCategory: 'Electrical Meter',
    unitName: 'KVA',
    meterType: 'Energy',
    status: false
  },
  {
    id: 15,
    meterCategory: 'BB Electrical',
    unitName: 'kva',
    meterType: 'Energy',
    status: true
  }
];

export const MeterTypeDashboard = () => {
  const [meters, setMeters] = useState(meterTypes);

  const toggleStatus = (id: number) => {
    setMeters(prev => prev.map(meter => 
      meter.id === id ? { ...meter, status: !meter.status } : meter
    ));
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Meter Types</h1>
            <p className="text-sm text-gray-600 mt-1">Setup &gt; Meter Type</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Meter Category</TableHead>
                <TableHead>Unit name</TableHead>
                <TableHead>Meter Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meters.map((meter) => (
                <TableRow key={meter.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{meter.meterCategory}</TableCell>
                  <TableCell>{meter.unitName}</TableCell>
                  <TableCell>{meter.meterType}</TableCell>
                  <TableCell>
                    <div 
                      className={`w-8 h-5 rounded-full flex items-center cursor-pointer ${meter.status ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => toggleStatus(meter.id)}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${meter.status ? 'translate-x-3' : 'translate-x-0.5'}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupLayout>
  );
};
