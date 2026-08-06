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

export interface BankMasterRowError {
  index?: number;
  errors: string[];
}

// Parses the backend's 422 error payload for bank_masters create/update, e.g.:
// { "errors": [{ "index": 0, "account_number": "...", "errors": ["Account type is not included in the list"] }] }
// Falls back to handling a flat array of strings or a Rails-style { field: ["msg"] } object,
// in case a different bank_masters endpoint returns errors in one of those shapes instead.
export const parseBankMasterApiErrors = (error: unknown): BankMasterRowError[] => {
  const data = (error as { response?: { data?: unknown } })?.response?.data as
    | { errors?: unknown }
    | undefined;
  const raw = data?.errors;

  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((item): BankMasterRowError => {
      if (item && typeof item === 'object' && 'errors' in (item as Record<string, unknown>)) {
        const entry = item as { index?: number; errors?: unknown };
        return {
          index: typeof entry.index === 'number' ? entry.index : undefined,
          errors: Array.isArray(entry.errors) ? entry.errors.map(String) : [String(entry.errors)],
        };
      }
      return { errors: [String(item)] };
    });
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).map(([field, messages]) => ({
      errors: (Array.isArray(messages) ? messages : [String(messages)]).map((m) => `${field} ${m}`),
    }));
  }

  return [{ errors: [String(raw)] }];
};

// Best-effort mapping of a backend error message to one of our form field keys, for inline display.
export const guessBankFieldFromMessage = (message: string): keyof BankRecord | null => {
  const lower = message.toLowerCase();
  if (lower.includes('account type')) return 'accountType';
  if (lower.includes('ifsc')) return 'ifscCode';
  if (lower.includes('swift')) return 'swiftCode';
  if (lower.includes('account number') || lower.includes('account_number')) return 'accountNo';
  if (lower.includes('branch')) return 'branch';
  if (lower.includes('beneficiary')) return 'beneficiaryName';
  if (lower.includes('bank name') || lower.includes('bank_name')) return 'bankName';
  return null;
};

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

// Alphabets, spaces, and a small set of punctuation used in real names/branches (. ' -). No digits or other special characters.
export const isValidNameLikeText = (value: string) => /^[A-Za-z][A-Za-z .'-]*$/.test(value.trim());
export const isValidAccountNumber = (value: string) => /^\d{9,18}$/.test(value.trim());

// Strips characters that isValidNameLikeText would reject, for live-filtering as the user types.
export const sanitizeNameLikeInput = (value: string) => value.replace(/[^A-Za-z .'-]/g, '');
export const sanitizeDigitsInput = (value: string, maxLength = 18) => value.replace(/\D/g, '').slice(0, maxLength);
export const sanitizeCodeInput = (value: string, maxLength: number) => value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxLength);

export const validateBankRecord = (record: BankRecord, existingAccountNumbers: string[] = []) => {
  const errors: Record<string, string> = {};

  const beneficiaryName = record.beneficiaryName.trim();
  if (!beneficiaryName) {
    errors.beneficiaryName = 'Beneficiary / Account Name is required';
  } else if (!isValidNameLikeText(beneficiaryName)) {
    errors.beneficiaryName = "Only alphabets, spaces, and . ' - are allowed";
  }

  const bankName = record.bankName.trim();
  if (!bankName) {
    errors.bankName = 'Bank Name is required';
  } else if (!isValidNameLikeText(bankName)) {
    errors.bankName = "Bank Name must contain only alphabets, spaces, and . ' - (no numbers)";
  }

  const accountNo = record.accountNo.trim();
  if (!accountNo) {
    errors.accountNo = 'A/c No. is required';
  } else if (!isValidAccountNumber(accountNo)) {
    errors.accountNo = 'A/c No. must be 9 to 18 digits';
  } else if (existingAccountNumbers.some((no) => no === accountNo)) {
    errors.accountNo = 'This Account Number already exists. Please enter a unique Account Number.';
  }

  if (!record.accountType.trim()) {
    errors.accountType = 'A/c Type is required';
  }

  const ifscCode = record.ifscCode.trim();
  if (!ifscCode) {
    errors.ifscCode = 'IFSC Code is required';
  } else if (!isValidIfscCode(ifscCode)) {
    errors.ifscCode = 'Enter a valid 11-character IFSC Code (e.g. SBIN0001234)';
  }

  const branch = record.branch.trim();
  if (!branch) {
    errors.branch = 'Branch is required';
  } else if (!isValidNameLikeText(branch)) {
    errors.branch = "Only alphabets, spaces, and . ' - are allowed (no numbers or random characters)";
  }

  if (!isValidSwiftCode(record.swiftCode)) {
    errors.swiftCode = 'Enter a valid SWIFT/BIC code (8 or 11 uppercase alphanumeric characters)';
  }

  return errors;
};

// Validates a single field in isolation (used for immediate on-blur feedback).
export const validateBankField = (
  record: BankRecord,
  field: keyof BankRecord,
  existingAccountNumbers: string[] = []
): string | undefined => validateBankRecord(record, existingAccountNumbers)[field as string];

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
