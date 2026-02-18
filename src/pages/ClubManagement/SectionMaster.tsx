import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Section {
  id: number;
  name: string;
  tax_type: 'TDS' | 'TCS';
  group_name: string;
}

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
  { key: 'name', label: 'Section Name', sortable: true, hideable: true, draggable: true },
  { key: 'tax_type', label: 'Tax Type', sortable: true, hideable: true, draggable: true },
  { key: 'group_name', label: 'Group Name', sortable: true, hideable: true, draggable: true },
];

export const SectionMaster: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSection, setNewSection] = useState({ name: '', tax_type: 'TDS', group_name: '' });

  // Simulate fetch
  useEffect(() => {
    // Replace with API call
    setLoading(true);
    setTimeout(() => {
      setSections([
        { id: 1, name: 'Section 194C', tax_type: 'TDS', group_name: 'Contractor' },
        { id: 2, name: 'Section 206C', tax_type: 'TCS', group_name: 'Scrap' },
      ]);
      setTotalRecords(2);
      setTotalPages(1);
      setLoading(false);
    }, 500);
  }, []);

  const renderRow = (section: Section) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" title="Edit"><Edit className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" title="Delete"><Trash2 className="w-4 h-4" /></Button>
      </div>
    ),
    name: <span>{section.name}</span>,
    tax_type: <span>{section.tax_type}</span>,
    group_name: <span>{section.group_name}</span>,
  });

  const handleAddSection = () => {
    if (!newSection.name.trim() || !newSection.group_name.trim()) return;
    setSections(prev => [
      ...prev,
      { id: Date.now(), ...newSection }
    ]);
    setAddModalOpen(false);
    setNewSection({ name: '', tax_type: 'TDS', group_name: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Section Master</h1>
      </header>
      <EnhancedTaskTable
        data={sections}
        columns={columns}
        renderRow={renderRow}
        storageKey="section-master-dashboard-v1"
        hideTableExport={true}
        hideTableSearch={true}
        enableSearch={false}
        isLoading={loading}
        leftActions={(
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90' onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        )}
      />
      {totalRecords > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          perPage={perPage}
          isLoading={loading}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
        />
      )}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-name">Name</Label>
              <Input id="section-name" value={newSection.name} onChange={e => setNewSection(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="tax-type">Tax Type</Label>
              <Select id="tax-type" value={newSection.tax_type} onValueChange={val => setNewSection(s => ({ ...s, tax_type: val as 'TDS' | 'TCS' }))}>
                <option value="TDS">TDS</option>
                <option value="TCS">TCS</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="group-name">Group Name</Label>
              <Input id="group-name" value={newSection.group_name} onChange={e => setNewSection(s => ({ ...s, group_name: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddSection}>Add</Button>
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionMaster;
