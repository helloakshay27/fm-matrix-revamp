export interface BankRecord {
  id: number;
  beneficiaryName: string;
  bankName: string;
  accountNo: string;
  accountType: string;
  ifscCode: string;
  swiftCode: string;
  branch: string;
  active: boolean;
}

interface ApiBankMasterRecord {
  id: number;
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  account_type: string;
  ifsc_code: string;
  swift_code: string;
  branch: string;
  active: boolean;
}

interface BankMasterPayloadFields {
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  account_type: string;
  ifsc_code: string;
  swift_code: string;
  branch: string;
}

export interface BankMasterPayload {
  bank_master: BankMasterPayloadFields;
}

export interface BankMastersBulkPayload {
  bank_masters: BankMasterPayloadFields[];
}

export const BANK_MASTER_API_PATH = 'bank_masters';

export const ACCOUNT_TYPE_OPTIONS = ['Savings', 'Current', 'Salary', 'NRE', 'NRO'];

export const getBankMasterApiConfig = () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const lockAccountId = localStorage.getItem('lock_account_id');

  return {
    baseUrl,
    lockAccountId,
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const bankMasterListUrl = (baseUrl: string | null, lockAccountId: string | null) =>
  `https://${baseUrl}/${BANK_MASTER_API_PATH}.json?lock_account_id=${lockAccountId}`;

export const bankMasterDetailUrl = (baseUrl: string | null, lockAccountId: string | null, id: number) =>
  `https://${baseUrl}/${BANK_MASTER_API_PATH}/${id}.json?lock_account_id=${lockAccountId}`;

export const bankMasterToggleActiveUrl = (baseUrl: string | null, lockAccountId: string | null, id: number) =>
  `https://${baseUrl}/${BANK_MASTER_API_PATH}/${id}/toggle_active.json?lock_account_id=${lockAccountId}`;

export const mapApiBankRecord = (raw: ApiBankMasterRecord): BankRecord => ({
  id: raw.id,
  beneficiaryName: raw.beneficiary_name || '',
  bankName: raw.bank_name || '',
  accountNo: raw.account_number || '',
  accountType: raw.account_type || '',
  ifscCode: raw.ifsc_code || '',
  swiftCode: raw.swift_code || '',
  branch: raw.branch || '',
  active: Boolean(raw.active),
});

export const createBlankBank = (): BankRecord => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  beneficiaryName: '',
  bankName: '',
  accountNo: '',
  accountType: '',
  ifscCode: '',
  swiftCode: '',
  branch: '',
  active: true,
});

export const isValidIfscCode = (value: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase());
export const isValidSwiftCode = (value: string) => !value || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.trim().toUpperCase());

export const validateBankRecord = (record: BankRecord) => {
  const errors: Record<string, string> = {};

  if (!record.beneficiaryName.trim()) {
    errors.beneficiaryName = 'Beneficiary / Account Name is required';
  }

  if (!record.bankName.trim()) {
    errors.bankName = 'Bank Name is required';
  }

  if (!record.accountNo.trim()) {
    errors.accountNo = 'A/c No. is required';
  } else if (!/^\d{8,20}$/.test(record.accountNo.trim())) {
    errors.accountNo = 'A/c No. must contain 8 to 20 digits';
  }

  if (!record.accountType.trim()) {
    errors.accountType = 'A/c Type is required';
  }

  if (!record.ifscCode.trim()) {
    errors.ifscCode = 'IFSC Code is required';
  } else if (!isValidIfscCode(record.ifscCode)) {
    errors.ifscCode = 'Enter a valid IFSC Code (e.g. SBIN0001234)';
  }

  if (!record.branch.trim()) {
    errors.branch = 'Branch is required';
  }

  if (!isValidSwiftCode(record.swiftCode)) {
    errors.swiftCode = 'Enter a valid SWIFT/BIC code';
  }

  return errors;
};

const toBankMasterFields = (record: BankRecord): BankMasterPayloadFields => ({
  beneficiary_name: record.beneficiaryName,
  bank_name: record.bankName,
  account_number: record.accountNo,
  account_type: record.accountType.toLowerCase(),
  ifsc_code: record.ifscCode,
  swift_code: record.swiftCode,
  branch: record.branch,
});

export const buildBankMasterPayload = (record: BankRecord): BankMasterPayload => ({
  bank_master: toBankMasterFields(record),
});

export const buildBankMastersPayload = (records: BankRecord[]): BankMastersBulkPayload => ({
  bank_masters: records.map(toBankMasterFields),
});
