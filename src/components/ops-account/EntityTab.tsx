import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload, File } from 'lucide-react';
import { toast } from 'sonner';

interface EntityTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const EntityTab: React.FC<EntityTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  // Entity state
  const [entities, setEntities] = useState([
    { entity: 'GoPhygital', status: true },
    { entity: 'TCS', status: true },
    { entity: 'Andheri', status: false },
    { entity: 'Noid 62', status: true },
    { entity: 'HSBC', status: true },
    { entity: 'lockated', status: true },
    { entity: 'demo', status: false },
    { entity: 'Sohail Ansari', status: true },
  ]);
  
  const [entityName, setEntityName] = useState('');
  const [showEntityForm, setShowEntityForm] = useState(false);

  const handleEntityStatusChange = (index: number, checked: boolean) => {
    const updatedEntities = [...entities];
    updatedEntities[index].status = checked;
    setEntities(updatedEntities);
  };

  const handleSubmitEntity = () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    // Check if entity already exists
    const entityExists = entities.some(entity => entity.entity.toLowerCase() === entityName.toLowerCase());
    if (entityExists) {
      toast.error('This entity already exists');
      return;
    }

    // Add the new entity to the entities array
    const newEntity = {
      entity: entityName,
      status: true
    };

    setEntities([...entities, newEntity]);
    toast.success(`Entity "${entityName}" added successfully`);

    // Reset form and close the form section
    setEntityName('');
    setShowEntityForm(false);
  };

  const handleImportEntity = () => {
    toast.success('Entity import functionality triggered');
  };

  const handleSampleFormat = () => {
    toast.info('Sample format downloaded');
  };

  const filteredEntities = entities.filter(entity =>
    entity.entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => setShowEntityForm(!showEntityForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entity
        </Button>
        
        <div className="flex items-center gap-4">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
            />
          </div>
        </div>
      </div>

      {/* Add Entity Form */}
      {showEntityForm && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add New Entity</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter entity name"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSubmitEntity}
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                >
                  Add Entity
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleImportEntity}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Entity
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSampleFormat}
                  className="flex items-center gap-2"
                >
                  <File className="w-4 h-4" />
                  Sample Format
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Entity</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    No entities found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntities.map((entity, index) => (
                  <TableRow key={index}>
                    <TableCell>{entity.entity}</TableCell>
                    <TableCell>
                      <Switch
                        checked={entity.status}
                        onCheckedChange={(checked) => handleEntityStatusChange(index, checked)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
