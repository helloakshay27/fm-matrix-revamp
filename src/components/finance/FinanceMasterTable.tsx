import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

// Finance Master ke saare tabs (TAX Code, GL Accounts, Storage Location) same
// additional_fields shape use karte hain: { id, content: { code, name, description } }
export interface FinanceMasterRecord {
  id: number | string;
  content?: {
    code?: string | number;
    name?: string;
    description?: string;
  };
}

const columns: ColumnConfig[] = [
  { key: "code", label: "Code", sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: "name", label: "Name", sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: "description", label: "Description", sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

interface FinanceMasterTableProps {
  data: FinanceMasterRecord[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  storageKey: string;
  emptyMessage: string;
  addLabel: string;
  onAdd: () => void;
}

// Code / name / description pe search — EnhancedTable ka default client search
// nested `content` object ko "[object Object]" bana deta hai, isliye yahan khud filter karte hain
export const filterFinanceMasterRecords = (records: FinanceMasterRecord[], searchTerm: string) => {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return records;
  return records.filter(record =>
    [record.content?.code, record.content?.name, record.content?.description]
      .some(value => String(value ?? '').toLowerCase().includes(query))
  );
};

export const FinanceMasterTable = ({
  data,
  loading,
  searchTerm,
  onSearchChange,
  storageKey,
  emptyMessage,
  addLabel,
  onAdd,
}: FinanceMasterTableProps) => {
  const rows = filterFinanceMasterRecords(data, searchTerm).map(record => ({
    id: record.id,
    code: record.content?.code ?? '',
    name: record.content?.name ?? '',
    description: record.content?.description ?? '',
  }));

  const renderCell = (item: (typeof rows)[number], columnKey: string) => {
    if (columnKey === "code") return <span className="font-medium">{item.code}</span>;
    if (columnKey === "description") return <span className="text-gray-600">{item.description || '-'}</span>;
    return item[columnKey as keyof typeof item];
  };

  return (
    <EnhancedTable
      data={rows}
      columns={columns}
      renderCell={renderCell}
      getItemId={(item) => String(item.id)}
      storageKey={storageKey}
      enableSearch={true}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      disableClientSearch={true}
      searchPlaceholder="Search by code, name or description..."
      emptyMessage={emptyMessage}
      loading={loading && data.length === 0}
      pagination={true}
      pageSize={10}
      leftActions={
        <Button onClick={onAdd} className="fm-button-fix fm-button-brand px-4 py-2">
          <Plus className="w-4 h-4" />
          {addLabel}
        </Button>
      }
    />
  );
};
