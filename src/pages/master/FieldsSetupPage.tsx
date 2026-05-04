import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { fieldsSetupService, SnagQuestion } from '@/services/fieldsSetupService';
import { toast } from 'sonner';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'checkbox', label: 'Checkbox' },
];

const emptyQuestion = (): SnagQuestion => ({ descr: '', qtype: 'text' });

const FieldsSetupPage = () => {
  const [existingFields, setExistingFields] = useState<SnagQuestion[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [newQuestions, setNewQuestions] = useState<SnagQuestion[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  const siteId = localStorage.getItem('site_id') || '2189';

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
      // Refresh existing fields
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fields Setup</h1>
      </div>

      {/* Existing Fields Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[#1a1a1a]">Existing Fields</h2>
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
          emptyMessage="No fields configured yet."
        />
      </div>

      {/* Add New Fields Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Add New Fields</h2>

        <div className="space-y-3">
          {newQuestions.map((question, index) => (
            <div key={index} className="flex gap-3 items-center">
              <span className="text-sm text-gray-500 w-6 text-right shrink-0">
                {index + 1}.
              </span>
              <input
                type="text"
                placeholder="Field description (e.g. User Name)"
                value={question.descr}
                onChange={(e) => handleQuestionChange(index, 'descr', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]/30 focus:border-[#C72030]"
              />
              <select
                value={question.qtype}
                onChange={(e) => handleQuestionChange(index, 'qtype', e.target.value)}
                className="w-36 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]/30 focus:border-[#C72030] bg-white"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {newQuestions.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50 shrink-0"
                  onClick={() => handleRemoveRow(index)}
                  title="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/5"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            {saving ? 'Saving...' : 'Save Setup'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldsSetupPage;
