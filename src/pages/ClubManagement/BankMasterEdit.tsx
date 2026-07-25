import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FormControl, MenuItem, Select as MuiSelect } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  ACCOUNT_TYPE_OPTIONS,
  BankRecord,
  bankMasterDetailUrl,
  bankMasterListUrl,
  buildBankMasterPayload,
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

const BankMasterEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [bank, setBank] = useState<BankRecord | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [otherAccountNumbers, setOtherAccountNumbers] = useState<string[]>([]);

  useEffect(() => {
    // No single-record GET endpoint is available, so the list is fetched and filtered by id.
    const loadBank = async () => {
      try {
        const { baseUrl, lockAccountId, headers } = getBankMasterApiConfig();
        const res = await axios.get(bankMasterListUrl(baseUrl, lockAccountId), { headers });
        const data = Array.isArray(res.data) ? res.data : (res.data?.bank_masters || res.data?.data || []);
        const allBanks = data.map(mapApiBankRecord);
        const found = allBanks.find((b: BankRecord) => String(b.id) === String(id));

        if (found) {
          setBank(found);
          setOtherAccountNumbers(
            allBanks.filter((b: BankRecord) => String(b.id) !== String(id)).map((b: BankRecord) => b.accountNo)
          );
        } else {
          setNotFound(true);
        }
      } catch {
        toast.error('Failed to load bank details');
        setNotFound(true);
      }
    };

    loadBank();
  }, [id]);

  const updateField = (field: keyof BankRecord, rawValue: string) => {
    const value = SANITIZERS[field] ? SANITIZERS[field]!(rawValue) : rawValue;

    setBank((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };

      if (LIVE_VALIDATE_FIELDS.includes(field)) {
        const message = value ? validateBankField(next, field, otherAccountNumbers) : '';
        setErrors((prevErrors) => ({ ...prevErrors, [field]: message || '' }));
      }

      return next;
    });

    if (!LIVE_VALIDATE_FIELDS.includes(field)) {
      setErrors((prev) => {
        if (!prev[field]) return prev;
        return { ...prev, [field]: '' };
      });
    }
  };

  const handleFieldBlur = (field: keyof BankRecord) => {
    if (!bank) return;
    const message = validateBankField(bank, field, otherAccountNumbers);
    setErrors((prev) => ({ ...prev, [field]: message || '' }));
  };

  const handleSave = async () => {
    if (!bank) return;

    const normalized: BankRecord = {
      ...bank,
      beneficiaryName: bank.beneficiaryName.trim(),
      bankName: bank.bankName.trim(),
      accountNo: bank.accountNo.trim(),
      accountType: bank.accountType.trim(),
      ifscCode: bank.ifscCode.trim().toUpperCase(),
      swiftCode: bank.swiftCode.trim().toUpperCase(),
      branch: bank.branch.trim(),
    };

    const rowErrors = validateBankRecord(normalized, otherAccountNumbers);

    if (Object.keys(rowErrors).length > 0) {
      setErrors(rowErrors);
      toast.error('Please fix the required bank details before saving.');
      return;
    }

    setIsSaving(true);

    try {
      const { baseUrl, lockAccountId, headers } = getBankMasterApiConfig();

      await axios.patch(
        bankMasterDetailUrl(baseUrl, lockAccountId, normalized.id),
        buildBankMasterPayload(normalized),
        { headers }
      );

      toast.success('Bank details updated successfully');
      navigate('/accounting/bank-master');
    } catch (error) {
      const rowErrors = parseBankMasterApiErrors(error);

      if (rowErrors.length > 0) {
        const inlineErrors: Record<string, string> = {};

        rowErrors.forEach((row) => {
          toast.error(row.errors.join(', '));
          row.errors.forEach((message) => {
            const field = guessBankFieldFromMessage(message);
            if (field) inlineErrors[field] = message;
          });
        });

        if (Object.keys(inlineErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...inlineErrors }));
        }
      } else {
        toast.error('Failed to update bank details');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (
    label: string,
    field: keyof BankRecord,
    value: string,
    required = true,
    placeholder = '',
    inputMode?: 'numeric',
    maxLength?: number
  ) => {
    const fieldError = errors[field];

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
          onChange={(e) => updateField(field, e.target.value)}
          onBlur={() => handleFieldBlur(field)}
          className={`mt-1 rounded-none ${fieldError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {fieldError && <p className="text-xs text-red-500">{fieldError}</p>}
      </div>
    );
  };

  if (notFound) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/accounting/bank-master')} className="p-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bank Master
          </Button>
        </div>
        <p className="text-sm text-slate-500">Bank record not found.</p>
      </div>
    );
  }

  if (!bank) {
    return null;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/accounting/bank-master')} className="p-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bank Master
        </Button>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Edit Bank Details</h1>

      <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderField('Beneficiary / Account Name', 'beneficiaryName', bank.beneficiaryName, true, 'Enter beneficiary or account name')}
          {renderField('Bank Name', 'bankName', bank.bankName, true, 'Enter bank name')}
          {renderField('A/c No.', 'accountNo', bank.accountNo, true, 'Enter account number', 'numeric', 18)}

          <div className="space-y-1.5">
            <Label>
              A/c Type
              <span className="text-red-500"> *</span>
            </Label>
            <FormControl fullWidth size="small" error={Boolean(errors.accountType)}>
              <MuiSelect
                displayEmpty
                value={bank.accountType}
                onChange={(e) => updateField('accountType', e.target.value)}
                renderValue={(val) =>
                  val ? val : <span style={{ color: '#aaa' }}>Select account type</span>
                }
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: errors.accountType ? '#d32f2f' : '#cbd5e1',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: errors.accountType ? '#d32f2f' : '#94a3b8',
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
            {errors.accountType && <p className="text-xs text-red-500">{errors.accountType}</p>}
          </div>

          {renderField('IFSC Code', 'ifscCode', bank.ifscCode, true, 'Enter IFSC Code', undefined, 11)}
          {renderField('Swift Code', 'swiftCode', bank.swiftCode, false, 'Enter SWIFT/BIC code', undefined, 11)}
          {renderField('Branch', 'branch', bank.branch, true, 'Enter branch name')}
        </div>
      </div>

      <div className="flex gap-3 mt-10 mb-5 justify-center">
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#C72030] hover:bg-[#A01020] text-white">
          {isSaving ? 'Saving...' : 'Update Bank Details'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/accounting/bank-master')} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BankMasterEdit;
