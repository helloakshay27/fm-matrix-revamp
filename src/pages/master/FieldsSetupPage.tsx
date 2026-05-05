import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { fieldsSetupService, SnagQuestion } from '@/services/fieldsSetupService';
import { toast } from 'sonner';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

// --- Field Styles for Material-UI Components ---
const fieldStyles = {
  height: "48px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    height: "48px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

const textareaStyles = {
  ...fieldStyles,
  height: "auto",
  "& .MuiOutlinedInput-root": {
    height: "auto",
    minHeight: "80px",
    padding: "16.5px 14px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
};

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'checkbox', label: 'Checkbox' },
];

// Predefined existing fields shown in the form (from image)
const PREDEFINED_FIELDS = [
  { id: 'category_enabled', label: 'Category Type', type: 'select' },
  { id: 'sub_category_enabled', label: 'Sub Category Type', type: 'select' },
  { id: 'assigned_to_enabled', label: 'Assigned To', type: 'select' },
  { id: 'mode_enabled', label: 'Mode', type: 'select' },
  { id: 'proactive_reactive_enabled', label: 'Proactive/Reactive', type: 'select' },
  { id: 'admin_priority_enabled', label: 'Admin Priority', type: 'select' },
  { id: 'severity_enabled', label: 'Severity', type: 'select' },
  { id: 'vendor_enabled', label: 'Vendor', type: 'select' },
  { id: 'reference_number_enabled', label: 'Reference Number', type: 'text' },
  { id: 'description_enabled', label: 'Description', type: 'textarea' },
  { id: 'location_enabled', label: 'Location', type: 'select' },
];

const emptyQuestion = (): SnagQuestion => ({ descr: '', qtype: 'text' });

const FieldsSetupPage = () => {
  const [activeTab, setActiveTab] = useState<'custom' | 'existing'>('existing');

  // Custom Fields state
  const [existingFields, setExistingFields] = useState<SnagQuestion[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [newQuestions, setNewQuestions] = useState<SnagQuestion[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  // Existing (predefined) fields enable/disable state
  const [fieldStates, setFieldStates] = useState<Record<string, boolean>>({});
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [togglingField, setTogglingField] = useState<string | null>(null);

  const siteId = localStorage.getItem('site_id') || '2189';

  useEffect(() => {
    const fetchExistingFields = async () => {
      try {
        setLoadingExisting(true);
        const data = await fieldsSetupService.getComplaintFields();
        // Assuming API returns object like { category_enabled: true, ... }
        // Filter to only include fields we have in PREDEFINED_FIELDS
        const states: Record<string, boolean> = {};
        PREDEFINED_FIELDS.forEach(f => {
          if (data && typeof data[f.id] !== 'undefined') {
            states[f.id] = data[f.id];
          } else {
            states[f.id] = false; // default
          }
        });
        setFieldStates(states);
      } catch (error) {
        console.error("Error fetching complaint fields:", error);
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchExistingFields();
  }, []);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoadingFields(true);
        const data = await fieldsSetupService.getFields(siteId);
        const fields: SnagQuestion[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.snag_questions)
          ? data.snag_questions
          : Array.isArray(data?.fields)
          ? data.fields
          : [];
        setExistingFields(fields);
      } catch {
        // error already shown via toast in service
      } finally {
        setLoadingFields(false);
      }
    };
    fetchFields();
  }, [siteId]);

  const handleQuestionChange = (
    index: number,
    field: keyof SnagQuestion,
    value: string
  ) => {
    setNewQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleAddRow = () => {
    setNewQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const handleRemoveRow = (index: number) => {
    setNewQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validQuestions = newQuestions.filter((q) => q.descr.trim() !== '');
    if (validQuestions.length === 0) {
      toast.error('Please add at least one field with a description.');
      return;
    }
    try {
      setSaving(true);
      await fieldsSetupService.setupFields(validQuestions);
      toast.success('Fields setup saved successfully.');
      const data = await fieldsSetupService.getFields(siteId);
      const fields: SnagQuestion[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.snag_questions)
        ? data.snag_questions
        : Array.isArray(data?.fields)
        ? data.fields
        : [];
      setExistingFields(fields);
      setNewQuestions([emptyQuestion()]);
    } catch {
      // error already shown via toast in service
    } finally {
      setSaving(false);
    }
  };

  const handleToggleField = async (fieldId: string) => {
    const newValue = !fieldStates[fieldId];
    setTogglingField(fieldId);
    try {
      // Prepare payload: only sending the field that changed or all of them?
      // Usually it's better to send only what's needed or match the required format.
      // The user's example shows multiple fields, but here we toggle one at a time.
      const payload = [
        {
          field_name: fieldId,
          field_value: String(newValue)
        }
      ];

      await fieldsSetupService.updateComplaintFields(payload);

      setFieldStates((prev) => ({ ...prev, [fieldId]: newValue }));
      toast.success(
        `${PREDEFINED_FIELDS.find((f) => f.id === fieldId)?.label} ${
          newValue ? 'enabled' : 'disabled'
        } successfully.`
      );
    } catch (error) {
      // error handled in service toast
    } finally {
      setTogglingField(null);
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      select: 'bg-blue-50 text-blue-700 border border-blue-200',
      text: 'bg-green-50 text-green-700 border border-green-200',
      textarea: 'bg-purple-50 text-purple-700 border border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fields Setup</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('existing')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === 'existing'
              ? 'border-[#C72030] text-[#C72030]'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Existing Fields
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === 'custom'
              ? 'border-[#C72030] text-[#C72030]'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Custom Fields
        </button>
      </div>

      {/* ── Existing Fields Tab ── */}
      {activeTab === 'existing' && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-[#1a1a1a]">
              Manage Field Visibility
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enable or disable each field as needed.
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 w-10">#</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Field Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingExisting ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#C72030] border-t-transparent rounded-full animate-spin" />
                      <span>Loading fields...</span>
                    </div>
                  </td>
                </tr>
              ) : PREDEFINED_FIELDS.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    No fields found.
                  </td>
                </tr>
              ) : (
                PREDEFINED_FIELDS.map((field, idx) => {
                const isEnabled = fieldStates[field.id];
                const isToggling = togglingField === field.id;
                return (
                  <tr
                    key={field.id}
                    className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">{field.label}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`capitalize text-xs px-2.5 py-1 rounded-full font-medium ${getTypeBadge(
                          field.type
                        )}`}
                      >
                        {field.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isEnabled
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isEnabled ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleField(field.id)}
                        disabled={isToggling}
                        title={isEnabled ? 'Disable this field' : 'Enable this field'}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
                          isEnabled
                            ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                            : 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isEnabled ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            Disable
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            Enable
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Custom Fields Tab ── */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Section: Add New Custom Fields */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "#E5E0D3" }}
                >
                  <HelpCircle size={16} color="#C72030" />
                </span>
                Add New Custom Fields
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">No. of Fields:</span>
                <span className="font-medium text-gray-900">
                  {newQuestions.length.toString().padStart(1, "0")}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div
                className={`grid gap-6 ${
                  newQuestions.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {newQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50/50 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">
                        Field {index + 1}
                      </h3>
                      {newQuestions.length > 1 && (
                        <Button
                          onClick={() => handleRemoveRow(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 p-1 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <TextField
                      label="Field Description"
                      placeholder="Enter field description (e.g. User Name)"
                      value={question.descr}
                      onChange={(e) => handleQuestionChange(index, 'descr', e.target.value)}
                      fullWidth
                      variant="outlined"
                      required
                      InputLabelProps={{
                        shrink: true,
                        sx: { "& .MuiInputLabel-asterisk": { color: "#ef4444" } },
                      }}
                      InputProps={{ sx: fieldStyles }}
                    />

                    <FormControl
                      fullWidth
                      variant="outlined"
                      required
                      sx={{
                        "& .MuiInputBase-root": fieldStyles,
                        "& .MuiInputLabel-asterisk": { color: "#ef4444" },
                      }}
                    >
                      <InputLabel shrink>Field Type</InputLabel>
                      <MuiSelect
                        value={question.qtype}
                        onChange={(e) => handleQuestionChange(index, 'qtype', e.target.value)}
                        label="Field Type"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">Choose Type</MenuItem>
                        {FIELD_TYPES.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            {t.label}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={handleAddRow}
                  className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/5 px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Field
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8"
                >
                  {saving ? 'Saving...' : 'Save Setup'}
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Custom Fields table */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-[#1a1a1a]">Saved Custom Fields</h2>
            <EnhancedTable
              loading={loadingFields}
              columns={[
                { key: 'srno', label: 'Sr. No.' },
                { key: 'descr', label: 'Description' },
                { key: 'qtype', label: 'Type' },
              ]}
              data={existingFields.map((f, idx) => ({ ...f, srno: idx + 1 }))}
              renderCell={(row, key) => {
                if (key === 'srno') return <span>{row[key]}</span>;
                if (key === 'qtype')
                  return (
                    <span className="capitalize px-2 py-0.5 rounded bg-gray-100 text-sm">
                      {row[key]}
                    </span>
                  );
                return row[key];
              }}
              emptyMessage="No custom fields configured yet."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldsSetupPage;
