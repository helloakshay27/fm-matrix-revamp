import React from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface MeterMeasureField {
  id: string;
  name: string;
  unitType: string;
  min: string;
  max: string;
  alertBelowVal: string;
  alertAboveVal: string;
  multiplierFactor: string;
  checkPreviousReading?: boolean;
}

interface MeterMeasureFieldsProps {
  title: string;
  fields: MeterMeasureField[];
  showCheckPreviousReading?: boolean;
  onFieldChange: (id: string, field: keyof MeterMeasureField, value: string | boolean) => void;
  onAddField: () => void;
  onRemoveField: (id: string) => void;
  unitTypes?: Array<{ id: number; unit_name: string }>;
  loadingUnitTypes?: boolean;
}

export const MeterMeasureFields: React.FC<MeterMeasureFieldsProps> = ({
  title,
  fields,
  showCheckPreviousReading = false,
  onFieldChange,
  onAddField,
  onRemoveField,
  unitTypes = [],
  loadingUnitTypes = false,
}) => {
  const meterUnitTypes = unitTypes.map(unit => ({
    value: unit.id.toString(),
    label: unit.unit_name,
  }));
  return (
    <div className="mb-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            {title}
          </h3>
          <button
            type="button"
            onClick={onAddField}
            className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      placeholder="Enter Text"
                      value={field.name}
                      onChange={(e) => onFieldChange(field.id, 'name', e.target.value)}
                    />
                  </div>

                  {/* Unit Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Type
                    </label>
                    <Select
                      value={field.unitType}
                      onValueChange={(value) => onFieldChange(field.id, 'unitType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingUnitTypes ? (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        ) : meterUnitTypes.length > 0 ? (
                          meterUnitTypes.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-options" disabled>No unit types available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter Number"
                      value={field.min}
                      onChange={(e) => onFieldChange(field.id, 'min', e.target.value)}
                    />
                  </div>

                  {/* Max */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter Number"
                      value={field.max}
                      onChange={(e) => onFieldChange(field.id, 'max', e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveField(field.id)}
                  className="ml-4 flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Alert Below Val */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Below Val.
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter Value"
                    value={field.alertBelowVal}
                    onChange={(e) => onFieldChange(field.id, 'alertBelowVal', e.target.value)}
                  />
                </div>

                {/* Alert Above Val */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Above Val.
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter Value"
                    value={field.alertAboveVal}
                    onChange={(e) => onFieldChange(field.id, 'alertAboveVal', e.target.value)}
                  />
                </div>

                {/* Multiplier Factor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Multiplier Factor
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter Number"
                    value={field.multiplierFactor}
                    onChange={(e) => onFieldChange(field.id, 'multiplierFactor', e.target.value)}
                  />
                </div>

                {/* Check Previous Reading - Only for consumption meters */}
                {showCheckPreviousReading && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.checkPreviousReading || false}
                      onCheckedChange={(checked) => onFieldChange(field.id, 'checkPreviousReading', checked)}
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Check Previous Reading
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No meter measures added yet.</p>
              <p className="text-sm">Click the + button to add a meter measure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};