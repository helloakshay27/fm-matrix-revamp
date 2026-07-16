import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BankRecord, readBanksFromStorage, writeBanksToStorage } from './bankMasterUtils';

const bankColumns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
  { key: 'sr_no', label: 'Sr No', sortable: false, hideable: false, draggable: false },
  { key: 'beneficiary_name', label: 'Beneficiary / Account Name', sortable: true, hideable: true, draggable: true },
  { key: 'bank_name', label: 'Bank Name', sortable: true, hideable: true, draggable: true },
  { key: 'account_no', label: 'A/c No.', sortable: true, hideable: true, draggable: true },
  { key: 'account_type', label: 'A/c Type', sortable: true, hideable: true, draggable: true },
  { key: 'ifsc_code', label: 'IFSC Code', sortable: true, hideable: true, draggable: true },
  { key: 'swift_code', label: 'Swift Code', sortable: true, hideable: true, draggable: true },
  { key: 'branch', label: 'Branch', sortable: true, hideable: true, draggable: true },
];

const BankMaster = () => {
  const navigate = useNavigate();
  const [banks, setBanks] = useState<BankRecord[]>([]);

  useEffect(() => {
    setBanks(readBanksFromStorage());
  }, []);

  const deleteBank = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bank detail?');

    if (!confirmDelete) return;

    setBanks((prev) => {
      const next = prev.filter((bank) => bank.id !== id);
      writeBanksToStorage(next);
      return next;
    });
    toast.success('Bank detail deleted successfully');
  };

  const renderRow = (bank: BankRecord, index: number) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => navigate(`/accounting/bank-master/edit/${bank.id}`)} title="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => deleteBank(bank.id)} title="Delete">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
    sr_no: <span>{index + 1}</span>,
    beneficiary_name: <span>{bank.beneficiaryName}</span>,
    bank_name: <span>{bank.bankName}</span>,
    account_no: <span>{bank.accountNo}</span>,
    account_type: <span>{bank.accountType}</span>,
    ifsc_code: <span>{bank.ifscCode}</span>,
    swift_code: <span>{bank.swiftCode || '-'}</span>,
    branch: <span>{bank.branch}</span>,
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bank Master</h1>
          <p className="text-sm text-slate-500">Manage beneficiary / account details with multi-bank support.</p>
        </div>
      </header>

      <div className="[&_*]:!rounded-none [&_.rounded-lg]:!rounded-none [&_.rounded-md]:!rounded-none [&_.rounded]:!rounded-none">
        <EnhancedTaskTable
          data={banks}
          columns={bankColumns}
          renderRow={renderRow}
          storageKey="bank-master-v1"
          hideTableExport
          enableSearch
          searchPlaceholder="Search bank details"
          leftActions={
            <Button onClick={() => navigate('/accounting/bank-master/add')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4 !text-white" />
              <span className="!text-white">Add Bank</span>
            </Button>
          }
          emptyMessage="No bank details found. Add your first bank record."
        />
      </div>
    </div>
  );
};

export default BankMaster;
