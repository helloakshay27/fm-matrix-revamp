
import React from 'react';
import { Eye, Plus, Download, Filter, Mail, ArrowUpDown, Search, RotateCcw } from 'lucide-react';
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SupplierTableProps {
  onAddSupplier: () => void;
}

const supplierData = [
  {
    id: '51024',
    companyName: 'Zoho Technologies Pvt Ltd',
    companyCode: '',
    gstinNumber: '33AAACZ5230C1ZU',
    panNumber: 'AAACZ5230C',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51023',
    companyName: 'Zoho Corporation Pvt Ltd',
    companyCode: '',
    gstinNumber: '33AAACZ4322M2Z9',
    panNumber: 'AAACZ4322M',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51022',
    companyName: 'ZK Realtors',
    companyCode: '',
    gstinNumber: '27AADPZ7065M1ZV',
    panNumber: 'AADPZ7065M',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '52206',
    companyName: 'YUG FACILITIES LLP',
    companyCode: '',
    gstinNumber: '27AABFY7556Q1Z7',
    panNumber: 'AABFY7556Q',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51021',
    companyName: 'Yerrow Fashion Retailers LLP',
    companyCode: '',
    gstinNumber: '19AABFY3051G1Z7',
    panNumber: 'AABFY3051G',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  }
];

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
  { key: 'companyName', label: 'Company Name', sortable: true, hideable: true, draggable: true },
  { key: 'companyCode', label: 'Company Code', sortable: true, hideable: true, draggable: true },
  { key: 'gstinNumber', label: 'GSTIN Number', sortable: true, hideable: true, draggable: true },
  { key: 'panNumber', label: 'PAN Number', sortable: true, hideable: true, draggable: true },
  { key: 'supplierType', label: 'Supplier Type', sortable: true, hideable: true, draggable: true },
  { key: 'poOutstandings', label: 'PO Outstandings', sortable: true, hideable: true, draggable: true },
  { key: 'woOutstandings', label: 'WO Outstandings', sortable: true, hideable: true, draggable: true },
  { key: 'ratings', label: 'Ratings', sortable: true, hideable: true, draggable: true },
  { key: 'signedOnContract', label: 'Signed On Contract', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'kycEndInDays', label: 'KYC End In Days', sortable: true, hideable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false }
];

export const SupplierTable = ({ onAddSupplier }: SupplierTableProps) => {
  const renderRow = (item: any) => ({
    id: item.id,
    companyName: item.companyName,
    companyCode: item.companyCode,
    gstinNumber: item.gstinNumber,
    panNumber: item.panNumber,
    supplierType: item.supplierType,
    poOutstandings: item.poOutstandings,
    woOutstandings: item.woOutstandings,
    ratings: item.ratings,
    signedOnContract: item.signedOnContract,
    status: (
      <div className="flex items-center">
        <div className={`w-12 h-6 rounded-full ${item.status ? 'bg-orange-500' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${item.status ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
        </div>
      </div>
    ),
    kycEndInDays: item.kycEndInDays,
    actions: (
      <button className="text-gray-400 hover:text-gray-600">
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
            onClick={onAddSupplier}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Download className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Mail className="w-4 h-4" />
            Invite
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            Sync Vendors
          </button>
        </div>
      </div>

      <EnhancedTable
        data={supplierData}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={true}
        enableExport={true}
        storageKey="supplier-table"
      />
    </div>
  );
};
