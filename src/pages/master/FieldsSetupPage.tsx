import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { fieldsSetupService, SnagQuestion } from '@/services/fieldsSetupService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: "8px",
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
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: "8px 14px",
    fontSize: "14px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#C72030",
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const isMuiOverlayTarget = (target: EventTarget | null) =>
  !!(target as HTMLElement | null)?.closest?.(
    ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
  );

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'checkbox', label: 'Checkbox' },
];

const PREDEFINED_FIELDS = [
  { id: 'category_enabled', label: 'Category Type', type: 'select' },
  { id: 'sub_category_enabled', label: 'Sub Category Type', type: 'select' },
  { id: 'assigned_to_enabled', label: 'Assigned To', type: 'select' },
  { id: 'proactive_reactive_enabled', label: 'Proactive/Reactive', type: 'select' },
  { id: 'admin_priority_enabled', label: 'Admin Priority', type: 'select' },
  { id: 'severity_enabled', label: 'Severity', type: 'select' },
  { id: 'vendor_enabled', label: 'Vendor', type: 'select' },
  { id: 'description_enabled', label: 'Description', type: 'textarea' },
  { id: 'location_enabled', label: 'Location', type: 'select' },
];

const emptyQuestion = (): SnagQuestion => ({ descr: '', qtype: 'text' });

const FieldsSetupPage = () => {
  const [activeTab, setActiveTab] = useState<'custom' | 'existing'>('existing');

  const [existingFields, setExistingFields] = useState<SnagQuestion[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [newQuestions, setNewQuestions] = useState<SnagQuestion[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [fieldStates, setFieldStates] = useState<Record<string, boolean>>({});
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [togglingField, setTogglingField] = useState<string | null>(null);

  const siteId = localStorage.getItem('selectedSiteId') || '';

  useEffect(() => {
    const fetchExistingFields = async () => {
      try {
        setLoadingExisting(true);
        const data = await fieldsSetupService.getComplaintFields();
        const states: Record<string, boolean> = {};
        PREDEFINED_FIELDS.forEach(f => {
          if (data && typeof data[f.id] !== 'undefined') {
            states[f.id] = data[f.id];
          } else {
            states[f.id] = false;
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
      setShowAddDialog(false);
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
      const payload = [
        {
          field_name: fieldId,
          field_value: String(newValue)
        }
      ];
      await fieldsSetupService.updateComplaintFields(payload);
      setFieldStates((prev) => ({ ...prev, [fieldId]: newValue }));
      toast.success(
        `${PREDEFINED_FIELDS.find((f) => f.id === fieldId)?.label} ${newValue ? 'enabled' : 'disabled'} successfully.`
      );
    } catch (error) {
      // error handled in service toast
    } finally {
      setTogglingField(null);
    }
  };

  const existingColumns: ColumnConfig[] = [
    { key: 'sr_no', label: 'Sr. No.', sortable: false, hideable: false },
    { key: 'label', label: 'Field Name', sortable: true, defaultVisible: true },
    { key: 'type', label: 'Type', sortable: true, defaultVisible: true },
    // { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
    { key: 'action', label: 'Status', sortable: false, hideable: false },
  ];

  const customColumns: ColumnConfig[] = [
    { key: 'sr_no', label: 'Sr. No.', sortable: false, hideable: false },
    { key: 'descr', label: 'Description', sortable: true, defaultVisible: true },
    { key: 'qtype', label: 'Type', sortable: true, defaultVisible: true },
  ];

  const existingData = PREDEFINED_FIELDS.map((field, idx) => ({
    ...field,
    sr_no: idx + 1,
    status: fieldStates[field.id] ? 'Enabled' : 'Disabled',
    isEnabled: fieldStates[field.id],
    isToggling: togglingField === field.id,
  }));

  const customData = existingFields.map((f, idx) => ({
    ...f,
    sr_no: idx + 1,
  }));

  const renderExistingCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case 'sr_no':
        return <span className="text-gray-900 font-medium">{item.sr_no}</span>;
      case 'label':
        return <span className="font-medium text-gray-800">{item.label}</span>;
      case 'type':
        return (
          <span className={`capitalize text-xs px-2.5 py-1 rounded-full font-medium ${
            item.type === 'select' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            item.type === 'text' ? 'bg-green-50 text-green-700 border border-green-200' :
            item.type === 'textarea' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
            'bg-gray-100 text-gray-600'
          }`}>
            {item.type}
          </span>
        );
      case 'status':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            item.isEnabled
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.isEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            {item.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        );
      case 'action':
        return (
          <div className="flex items-center justify-center">
            <Switch
              checked={item.isEnabled}
              onCheckedChange={() => handleToggleField(item.id)}
              disabled={item.isToggling}
            />
          </div>
        );
      default:
        return item[columnKey] ?? '--';
    }
  }, [fieldStates, togglingField]);

  const renderCustomCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case 'sr_no':
        return <span className="text-gray-900 font-medium">{item.sr_no}</span>;
      case 'descr':
        return <span className="font-medium text-gray-800">{item.descr}</span>;
      case 'qtype':
        return (
          <span className="capitalize px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {item.qtype}
          </span>
        );
      default:
        return item[columnKey] ?? '--';
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('existing')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === 'existing'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Existing Fields
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === 'custom'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Custom Fields
        </button>
      </div>

      {/* Existing Fields Tab */}
      {activeTab === 'existing' && (
        <div className="space-y-4">
          {/* <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-base font-semibold text-gray-900">Manage Field Visibility</h2>
            <p className="text-xs text-gray-500 mt-0.5">Enable or disable each field as needed.</p>
          </div> */}
          <EnhancedTable
            data={existingData}
            columns={existingColumns}
            renderCell={renderExistingCell}
            storageKey="fields-setup-existing"
            loading={loadingExisting}
            loadingMessage="Loading fields..."
            emptyMessage="No fields found"
            enableSearch={true}
            searchTerm={searchQuery}
            onSearchChange={handleSearch}
            searchPlaceholder="Search fields..."
            pagination={true}
            pageSize={10}
          />
        </div>
      )}

      {/* Custom Fields Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <EnhancedTable
            data={customData}
            columns={customColumns}
            renderCell={renderCustomCell}
            storageKey="fields-setup-custom"
            loading={loadingFields}
            loadingMessage="Loading custom fields..."
            emptyMessage="No custom fields configured yet."
            enableSearch={true}
            searchTerm={searchQuery}
            onSearchChange={handleSearch}
            searchPlaceholder="Search custom fields..."
            pagination={true}
            pageSize={10}
            leftActions={
              <Button
                onClick={() => {
                  setNewQuestions([emptyQuestion()]);
                  setShowAddDialog(true);
                }}
                className="bg-brand hover:bg-brand-hover text-white h-9 px-4 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            }
          />

          {/* Add Custom Fields Dialog */}
          {/* modal={false} lets portaled MUI Select menus receive clicks/scroll */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog} modal={false}>
            <DialogContent
              className="max-w-3xl max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => {
                if (isMuiOverlayTarget(e.target)) {
                  e.preventDefault();
                }
              }}
              onInteractOutside={(e) => {
                if (isMuiOverlayTarget(e.target)) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                    <HelpCircle size={16} className="text-brand" />
                  </span>
                  Add New Custom Fields
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-center justify-end">
                  <span className="text-sm text-gray-600">
                    Fields: <span className="font-medium text-gray-900">{newQuestions.length}</span>
                  </span>
                </div>

                <div className={`grid gap-4 ${newQuestions.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                  {newQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50 relative"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 text-sm">Field {index + 1}</h3>
                        {newQuestions.length > 1 && (
                          <Button
                            onClick={() => handleRemoveRow(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1 h-7 w-7"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <TextField
                        label="Field Description"
                        placeholder="Enter field description"
                        value={question.descr}
                        onChange={(e) => handleQuestionChange(index, 'descr', e.target.value)}
                        fullWidth
                        variant="outlined"
                        required
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                          sx: { "& .MuiInputLabel-asterisk": { color: "#ef4444" } },
                        }}
                        sx={fieldStyles}
                      />

                      <FormControl
                        fullWidth
                        variant="outlined"
                        required
                        size="small"
                        sx={{ "& .MuiInputLabel-asterisk": { color: "#ef4444" } }}
                      >
                        <InputLabel id={`field-type-label-${index}`} shrink>Field Type</InputLabel>
                        <MuiSelect
                          labelId={`field-type-label-${index}`}
                          value={question.qtype}
                          onChange={(e) => handleQuestionChange(index, 'qtype', e.target.value)}
                          label="Field Type"
                          notched
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
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

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={handleAddRow}
                    className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] px-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Field
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="border-[#C72030] text-[#C72030]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-brand hover:bg-brand-hover text-white px-6"
                    >
                      {saving ? 'Saving...' : 'Save Setup'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default FieldsSetupPage;
