export interface BankRecord {
  id: number;
  beneficiaryName: string;
  bankName: string;
  accountNo: string;
  accountType: string;
  ifscCode: string;
  swiftCode: string;
  branch: string;
}

interface BankPayloadRecord {
  beneficiary_name: string;
  bank_name: string;
  account_no: string;
  account_type: string;
  ifsc_code: string;
  swift_code: string;
  branch: string;
}

interface BankCreatePayload {
  pms_bank_master: {
    bank_accounts_attributes: BankPayloadRecord[];
  };
}

interface BankUpdatePayload {
  pms_bank_master: {
    id: number;
    beneficiary_name: string;
    bank_name: string;
    account_no: string;
    account_type: string;
    ifsc_code: string;
    swift_code: string;
    branch: string;
  };
}

export const BANK_MASTER_STORAGE_KEY = 'fm-bank-master-records';

// Dummy/placeholder endpoint (mirrors the erp_uoms.json convention used by UnitMaster.tsx)
// until the real Bank Master API is available. Local storage stays the source of truth.
export const BANK_MASTER_API_PATH = 'pms_bank_masters';

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

export const createBlankBank = (): BankRecord => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  beneficiaryName: '',
  bankName: '',
  accountNo: '',
  accountType: '',
  ifscCode: '',
  swiftCode: '',
  branch: '',
});

export const readBanksFromStorage = (): BankRecord[] => {
  const storedBanks = localStorage.getItem(BANK_MASTER_STORAGE_KEY);

  if (!storedBanks) return [];

  try {
    const parsedBanks = JSON.parse(storedBanks) as BankRecord[];
    return Array.isArray(parsedBanks) ? parsedBanks : [];
  } catch {
    return [];
  }
};

export const writeBanksToStorage = (banks: BankRecord[]) => {
  localStorage.setItem(BANK_MASTER_STORAGE_KEY, JSON.stringify(banks));
};

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

export const buildBankPayloadForCreate = (records: BankRecord[]): BankCreatePayload => ({
  pms_bank_master: {
    bank_accounts_attributes: records.map((record) => ({
      beneficiary_name: record.beneficiaryName,
      bank_name: record.bankName,
      account_no: record.accountNo,
      account_type: record.accountType,
      ifsc_code: record.ifscCode,
      swift_code: record.swiftCode,
      branch: record.branch,
    })),
  },
});

export const buildBankPayloadForUpdate = (record: BankRecord): BankUpdatePayload => ({
  pms_bank_master: {
    id: record.id,
    beneficiary_name: record.beneficiaryName,
    bank_name: record.bankName,
    account_no: record.accountNo,
    account_type: record.accountType,
    ifsc_code: record.ifscCode,
    swift_code: record.swiftCode,
    branch: record.branch,
  },
});
