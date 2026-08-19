import React, { useEffect, useState } from 'react';
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
  BankRecord,
  bankMasterListUrl,
  buildBankMastersPayload,
  createBlankBank,
  getBankMasterApiConfig,
  guessBankFieldFromMessage,
  mapApiBankRecord,
  parseBankMasterApiErrors,
  sanitizeCodeInput,
  sanitizeDigitsInput,
  sanitizeNameLikeInput,
  validateBankField,
  validateBankRecord,
} from './bankMasterUtils';

const SANITIZERS: Partial<Record<keyof BankRecord, (value: string) => string>> = {
  beneficiaryName: sanitizeNameLikeInput,
  bankName: sanitizeNameLikeInput,
  branch: sanitizeNameLikeInput,
  accountNo: (value) => sanitizeDigitsInput(value, 18),
  ifscCode: (value) => sanitizeCodeInput(value, 11),
  swiftCode: (value) => sanitizeCodeInput(value, 11),
};

// These have an objective, checkable format (digits-only length, fixed-format codes), so they
// validate on every keystroke instead of waiting for blur — invalid input is flagged immediately.
const LIVE_VALIDATE_FIELDS: (keyof BankRecord)[] = ['accountNo', 'ifscCode', 'swiftCode'];

const BankMasterAdd = () => {
  const navigate = useNavigate();
  const [draftBanks, setDraftBanks] = useState<BankRecord[]>([createBlankBank()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [existingAccountNumbers, setExistingAccountNumbers] = useState<string[]>([]);

  useEffect(() => {
    const loadExistingBanks = async () => {
      try {
        const { baseUrl, lockAccountId, headers } = getBankMasterApiConfig();
        const res = await axios.get(bankMasterListUrl(baseUrl, lockAccountId), { headers });
        const data = Array.isArray(res.data) ? res.data : (res.data?.bank_masters || res.data?.data || []);
        setExistingAccountNumbers(data.map(mapApiBankRecord).map((b: BankRecord) => b.accountNo));
      } catch {
        // Non-fatal: duplicate-account-number check simply won't have existing data to compare against.
      }
    };

    loadExistingBanks();
  }, []);

  const computeOtherAccountNumbers = (rows: BankRecord[], index: number) => [
    ...existingAccountNumbers,
    ...rows.filter((_, idx) => idx !== index).map((row) => row.accountNo.trim()),
  ];

  const updateDraftRow = (index: number, field: keyof BankRecord, rawValue: string) => {
    const value = SANITIZERS[field] ? SANITIZERS[field]!(rawValue) : rawValue;
    const key = `${index}-${field}`;

    setDraftBanks((prev) => {
      const next = prev.map((record, idx) => (idx === index ? { ...record, [field]: value } : record));

      if (LIVE_VALIDATE_FIELDS.includes(field)) {
        const message = value ? validateBankField(next[index], field, computeOtherAccountNumbers(next, index)) : '';
        setErrors((prevErrors) => ({ ...prevErrors, [key]: message || '' }));
      }

      return next;
    });

    if (!LIVE_VALIDATE_FIELDS.includes(field)) {
      setErrors((prev) => {
        if (!prev[key]) return prev;
        return { ...prev, [key]: '' };
      });
    }
  };

  const handleFieldBlur = (index: number, field: keyof BankRecord) => {
    const record = draftBanks[index];
    const message = validateBankField(record, field, computeOtherAccountNumbers(draftBanks, index));
    const key = `${index}-${field}`;
    setErrors((prev) => ({ ...prev, [key]: message || '' }));
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
      const otherNumbers = [
        ...existingAccountNumbers,
        ...normalizedRows.filter((_, idx) => idx !== index).map((r) => r.accountNo),
      ];
      const rowErrors = validateBankRecord(row, otherNumbers);
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
      const { baseUrl, lockAccountId, headers } = getBankMasterApiConfig();

      await axios.post(
        bankMasterListUrl(baseUrl, lockAccountId),
        buildBankMastersPayload(normalizedRows),
        { headers }
      );

      toast.success(`${normalizedRows.length} bank detail${normalizedRows.length > 1 ? 's' : ''} added successfully`);
      navigate('/accounting/bank-master');
    } catch (error) {
      const rowErrors = parseBankMasterApiErrors(error);

      if (rowErrors.length > 0) {
        const inlineErrors: Record<string, string> = {};

        rowErrors.forEach((row) => {
          const label = typeof row.index === 'number' && normalizedRows.length > 1
            ? `Bank Record ${row.index + 1}: `
            : '';
          toast.error(`${label}${row.errors.join(', ')}`);

          if (typeof row.index === 'number') {
            row.errors.forEach((message) => {
              const field = guessBankFieldFromMessage(message);
              if (field) inlineErrors[`${row.index}-${field}`] = message;
            });
          }
        });

        if (Object.keys(inlineErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...inlineErrors }));
        }
      } else {
        toast.error('Failed to save bank details');
      }
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
    inputMode?: 'numeric',
    maxLength?: number
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
          type="text"
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => updateDraftRow(index, field, e.target.value)}
          onBlur={() => handleFieldBlur(index, field)}
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

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Bank Details</h1>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Add one or more bank records. Required fields are marked with <span className="text-red-500">*</span>.
      </p>

      <div className="space-y-4">
        {draftBanks.map((row, index) => (
          <React.Fragment key={`${row.id}-${index}`}>
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
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
                {renderField('A/c No.', 'accountNo', row.accountNo, index, true, 'Enter account number', 'numeric', 18)}

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

                {renderField('IFSC Code', 'ifscCode', row.ifscCode, index, true, 'Enter IFSC Code', undefined, 11)}
                {renderField('Swift Code', 'swiftCode', row.swiftCode, index, false, 'Enter SWIFT/BIC code', undefined, 11)}
                {renderField('Branch', 'branch', row.branch, index, true, 'Enter branch name')}
              </div>
            </div>

            {index === draftBanks.length - 1 && (
              <div className="mt-1 flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={addAnotherBankRow}>
                  <CirclePlus className="mr-2 h-4 w-4" />
                  Add Another Bank
                </Button>
              </div>
            )}
          </React.Fragment>
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
