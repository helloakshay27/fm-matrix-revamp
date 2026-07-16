import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormControl, MenuItem, Select as MuiSelect } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CirclePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  ACCOUNT_TYPE_OPTIONS,
  BANK_MASTER_API_PATH,
  BankRecord,
  buildBankPayloadForCreate,
  createBlankBank,
  getBankMasterApiConfig,
  readBanksFromStorage,
  validateBankRecord,
  writeBanksToStorage,
} from './bankMasterUtils';

const BankMasterAdd = () => {
  const navigate = useNavigate();
  const [draftBanks, setDraftBanks] = useState<BankRecord[]>([createBlankBank()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateDraftRow = (index: number, field: keyof BankRecord, value: string) => {
    setDraftBanks((prev) =>
      prev.map((record, idx) => (idx === index ? { ...record, [field]: value } : record))
    );

    const key = `${index}-${field}`;
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: '' };
    });
  };

  const addAnotherBankRow = () => {
    setDraftBanks((prev) => [...prev, createBlankBank()]);
  };

  const removeDraftRow = (index: number) => {
    if (draftBanks.length === 1) {
      toast.warning('At least one bank row is required');
      return;
    }

    setDraftBanks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    const normalizedRows = draftBanks.map((row) => ({
      ...row,
      beneficiaryName: row.beneficiaryName.trim(),
      bankName: row.bankName.trim(),
      accountNo: row.accountNo.trim(),
      accountType: row.accountType.trim(),
      ifscCode: row.ifscCode.trim().toUpperCase(),
      swiftCode: row.swiftCode.trim().toUpperCase(),
      branch: row.branch.trim(),
    }));

    const allErrors: Record<string, string> = {};

    normalizedRows.forEach((row, index) => {
      const rowErrors = validateBankRecord(row);
      Object.entries(rowErrors).forEach(([field, message]) => {
        allErrors[`${index}-${field}`] = message;
      });
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Please fix the required bank details before saving.');
      return;
    }

    setIsSaving(true);

    try {
      const apiPayload = buildBankPayloadForCreate(normalizedRows);
      const { baseUrl, lockAccountId, headers } = getBankMasterApiConfig();

      try {
        await axios.post(
          `https://${baseUrl}/${BANK_MASTER_API_PATH}.json?lock_account_id=${lockAccountId}`,
          apiPayload,
          { headers }
        );
      } catch {
        // Dummy/placeholder endpoint until the real Bank Master API is available.
        // Fall through and keep local storage as the source of truth so the UI keeps working.
      }

      const nextBanks = normalizedRows.map((row) => ({
        ...row,
        id: Date.now() + Math.floor(Math.random() * 100000),
      }));
      writeBanksToStorage([...nextBanks, ...readBanksFromStorage()]);
      toast.success(`${nextBanks.length} bank detail${nextBanks.length > 1 ? 's' : ''} added successfully`);
      navigate('/accounting/bank-master');
    } catch {
      toast.error('Failed to save bank details');
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (
    label: string,
    field: keyof BankRecord,
    value: string,
    index: number,
    required = true,
    placeholder = '',
    type: 'text' | 'number' = 'text'
  ) => {
    const errorKey = `${index}-${field}`;
    const fieldError = errors[errorKey];

    return (
      <div className="space-y-1.5">
        <Label>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => updateDraftRow(index, field, e.target.value)}
          className={`mt-1 rounded-none ${fieldError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {fieldError && <p className="text-xs text-red-500">{fieldError}</p>}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/accounting/bank-master')} className="p-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bank Master
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Add Bank Details</h1>
        <Button type="button" variant="outline" onClick={addAnotherBankRow}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Another Bank
        </Button>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Add one or more bank records. Required fields are marked with <span className="text-red-500">*</span>.
      </p>

      <div className="space-y-4">
        {draftBanks.map((row, index) => (
          <div key={`${row.id}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Bank Record {index + 1}</h3>
              {draftBanks.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeDraftRow(index)}>
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {renderField('Beneficiary / Account Name', 'beneficiaryName', row.beneficiaryName, index, true, 'Enter beneficiary or account name')}
              {renderField('Bank Name', 'bankName', row.bankName, index, true, 'Enter bank name')}
              {renderField('A/c No.', 'accountNo', row.accountNo, index, true, 'Enter account number', 'number')}

              <div className="space-y-1.5">
                <Label>
                  A/c Type
                  <span className="text-red-500"> *</span>
                </Label>
                <FormControl fullWidth size="small" error={Boolean(errors[`${index}-accountType`])}>
                  <MuiSelect
                    displayEmpty
                    value={row.accountType}
                    onChange={(e) => updateDraftRow(index, 'accountType', e.target.value)}
                    renderValue={(val) =>
                      val ? val : <span style={{ color: '#aaa' }}>Select account type</span>
                    }
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: errors[`${index}-accountType`] ? '#d32f2f' : '#cbd5e1',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: errors[`${index}-accountType`] ? '#d32f2f' : '#94a3b8',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C72030',
                      },
                      backgroundColor: '#fff',
                      borderRadius: 0,
                    }}
                  >
                    <MenuItem value=""><em>Select account type</em></MenuItem>
                    {ACCOUNT_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                {errors[`${index}-accountType`] && <p className="text-xs text-red-500">{errors[`${index}-accountType`]}</p>}
              </div>

              {renderField('IFSC Code', 'ifscCode', row.ifscCode, index, true, 'Enter IFSC Code')}
              {renderField('Swift Code', 'swiftCode', row.swiftCode, index, false, 'Enter SWIFT/BIC code')}
              {renderField('Branch', 'branch', row.branch, index, true, 'Enter branch name')}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-10 mb-5 justify-center">
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#C72030] hover:bg-[#A01020] text-white">
          {isSaving ? 'Saving...' : 'Save Bank Details'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/accounting/bank-master')} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BankMasterAdd;
