
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Settings, ChevronDown, ChevronUp } from "lucide-react";

interface MappingRow {
  id: string;
  asset: string;
  readingEBKVAH: string;
  readingDGKVAH: string;
  voltage: string;
  current: string;
  kW: string;
  pF: string;
  thdI: string;
}

interface MappingStepProps {
  data: {
    mappings: MappingRow[];
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const MappingStep = ({ 
  data, 
  onChange, 
  isCompleted = false, 
  isCollapsed = false, 
  onToggleCollapse 
}: MappingStepProps) => {

  const addRow = () => {
    const newRow: MappingRow = {
      id: `row_${Date.now()}`,
      asset: '',
      readingEBKVAH: '',
      readingDGKVAH: '',
      voltage: '',
      current: '',
      kW: '',
      pF: '',
      thdI: ''
    };
    onChange('mappings', [...(data.mappings || []), newRow]);
  };

  const updateRow = (id: string, field: string, value: string) => {
    const updatedMappings = (data.mappings || []).map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    onChange('mappings', updatedMappings);
  };

  const removeRow = (id: string) => {
    const updatedMappings = (data.mappings || []).filter(row => row.id !== id);
    onChange('mappings', updatedMappings);
  };

  const assetOptions = [
    'Generator 1',
    'Generator 2', 
    'Main Panel',
    'UPS System',
    'Transformer 1',
    'Transformer 2',
    'Motor 1',
    'Motor 2'
  ];

  const parameterOptions = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4'
  ];

  // Collapsed view
  if (isCompleted && isCollapsed) {
    const mappedCount = (data.mappings || []).length;
    
    return (
      <Card className="mb-6 border-green-600">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <CardTitle className="text-green-600 text-lg">Mapping</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onToggleCollapse}
                className="text-[#C72030] hover:text-[#C72030]/80"
              >
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onToggleCollapse}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {mappedCount} mapping row{mappedCount !== 1 ? 's' : ''} configured
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`mb-6 ${isCompleted ? 'border-green-600' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={addRow}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
            {isCompleted && onToggleCollapse && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onToggleCollapse}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F6F4EE]">
                <TableHead className="font-semibold text-gray-900">Asset</TableHead>
                <TableHead className="font-semibold text-gray-900">Reading in EBKVAH</TableHead>
                <TableHead className="font-semibold text-gray-900">Reading in DGKVAH</TableHead>
                <TableHead className="font-semibold text-gray-900">Voltage</TableHead>
                <TableHead className="font-semibold text-gray-900">Current</TableHead>
                <TableHead className="font-semibold text-gray-900">kW</TableHead>
                <TableHead className="font-semibold text-gray-900">PF</TableHead>
                <TableHead className="font-semibold text-gray-900">THD (I)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.mappings || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Select 
                      value={row.asset} 
                      onValueChange={(value) => updateRow(row.id, 'asset', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.readingEBKVAH} 
                      onValueChange={(value) => updateRow(row.id, 'readingEBKVAH', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.readingDGKVAH} 
                      onValueChange={(value) => updateRow(row.id, 'readingDGKVAH', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.voltage} 
                      onValueChange={(value) => updateRow(row.id, 'voltage', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.current} 
                      onValueChange={(value) => updateRow(row.id, 'current', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.kW} 
                      onValueChange={(value) => updateRow(row.id, 'kW', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.pF} 
                      onValueChange={(value) => updateRow(row.id, 'pF', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.thdI} 
                      onValueChange={(value) => updateRow(row.id, 'thdI', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {(data.mappings || []).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No mapping rows added yet. Click "Add Row" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
