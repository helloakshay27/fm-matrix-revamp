import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronDown, Edit, Trash2 } from 'lucide-react';
import { ESCALATION_LEVELS, PRIORITY_LEVELS, ESCALATION_TO_OPTIONS, ResolutionEscalationRule, EscalationLevel, PriorityTiming } from '@/types/escalationMatrix';

const resolutionEscalationSchema = z.object({
  categoryType: z.string().min(1, 'Category type is required'),
  escalationLevels: z.array(z.object({
    id: z.string(),
    level: z.enum(['E1', 'E2', 'E3', 'E4', 'E5']),
    escalationTo: z.string().min(1, 'Escalation to is required'),
  })).length(5),
  priorityTimings: z.array(z.object({
    priority: z.enum(['P1', 'P2', 'P3', 'P4', 'P5']),
    days: z.number().min(0),
    hours: z.number().min(0).max(23),
    minutes: z.number().min(0).max(59),
  })).length(5),
});

type ResolutionEscalationFormData = z.infer<typeof resolutionEscalationSchema>;

export const ResolutionEscalationTab: React.FC = () => {
  const [rules, setRules] = useState<ResolutionEscalationRule[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const createDefaultEscalationLevels = (): EscalationLevel[] => {
    return ESCALATION_LEVELS.map(level => ({
      id: `${level}-${Date.now()}`,
      level,
      escalationTo: '',
    }));
  };

  const createDefaultPriorityTimings = (): PriorityTiming[] => {
    return PRIORITY_LEVELS.map(priority => ({
      priority,
      days: 0,
      hours: 0,
      minutes: 0,
    }));
  };

  const form = useForm<ResolutionEscalationFormData>({
    resolver: zodResolver(resolutionEscalationSchema),
    defaultValues: {
      categoryType: '',
      escalationLevels: createDefaultEscalationLevels(),
      priorityTimings: createDefaultPriorityTimings(),
    },
  });

  const handleSubmit = (data: ResolutionEscalationFormData) => {
    const newRule: ResolutionEscalationRule = {
      id: Date.now().toString(),
      categoryType: data.categoryType,
      escalationLevels: data.escalationLevels as EscalationLevel[],
      createdOn: new Date().toISOString(),
      createdBy: 'Current User',
      active: true,
    };

    setRules(prev => [...prev, newRule]);
    form.reset({
      categoryType: '',
      escalationLevels: createDefaultEscalationLevels(),
      priorityTimings: createDefaultPriorityTimings(),
    });
  };

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const filteredRules = selectedCategoryFilter && selectedCategoryFilter !== 'all'
    ? rules.filter(rule => rule.categoryType === selectedCategoryFilter)
    : rules;

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create Resolution Escalation Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Category Type Selection */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="categoryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Air Conditioner">Air Conditioner</SelectItem>
                            <SelectItem value="Accounting">Accounting</SelectItem>
                            <SelectItem value="ELECTRICAL WORK">ELECTRICAL WORK</SelectItem>
                            <SelectItem value="Technical-1">Technical-1</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="HVAC">HVAC</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Escalation Levels and Priority Timings Table */}
              <div>
                <h3 className="text-lg font-medium mb-4">Response up to Escalation</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border-r px-4 py-3 text-left font-medium">Levels</th>
                        <th className="border-r px-4 py-3 text-center font-medium">Escalation To</th>
                        <th className="border-r px-4 py-3 text-center font-medium">P1</th>
                        <th className="border-r px-4 py-3 text-center font-medium">P2</th>
                        <th className="border-r px-4 py-3 text-center font-medium">P3</th>
                        <th className="border-r px-4 py-3 text-center font-medium">P4</th>
                        <th className="px-4 py-3 text-center font-medium">P5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ESCALATION_LEVELS.map((level, levelIndex) => (
                        <tr key={level} className="border-t">
                          <td className="border-r px-4 py-3 font-medium">{level}</td>
                          <td className="border-r px-4 py-3">
                            <FormField
                              control={form.control}
                              name={`escalationLevels.${levelIndex}.escalationTo`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an Option" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {ESCALATION_TO_OPTIONS.map(option => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          {PRIORITY_LEVELS.map((priority, priorityIndex) => (
                            <td key={priority} className={`px-2 py-3 ${priority !== 'P5' ? 'border-r' : ''}`}>
                              <div className="flex gap-1 justify-center">
                                <FormField
                                  control={form.control}
                                  name={`priorityTimings.${priorityIndex}.days`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          className="w-12 h-8 text-xs text-center"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <span className="text-xs text-muted-foreground">day,</span>
                                <FormField
                                  control={form.control}
                                  name={`priorityTimings.${priorityIndex}.hours`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          className="w-12 h-8 text-xs text-center"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <span className="text-xs text-muted-foreground">hour,</span>
                                <FormField
                                  control={form.control}
                                  name={`priorityTimings.${priorityIndex}.minutes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          className="w-12 h-8 text-xs text-center"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <span className="text-xs text-muted-foreground">minute</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Submit
                </Button>
                <Button type="button" variant="outline">
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Type</label>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Air Conditioner">Air Conditioner</SelectItem>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="ELECTRICAL WORK">ELECTRICAL WORK</SelectItem>
                  <SelectItem value="Technical-1">Technical-1</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm">
                Apply
              </Button>
              <Button variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Rules Table */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <p className="text-muted-foreground">No rules found. Create your first rule above.</p>
        ) : (
          filteredRules.map((rule, index) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rule {index + 1}</span>
                      <Button variant="ghost" size="sm" className="text-orange-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRuleExpansion(rule.id)}
                  >
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedRules.has(rule.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border-r px-4 py-3 text-left font-medium">Category Type</th>
                        <th className="border-r px-4 py-3 text-center font-medium">Levels</th>
                        <th className="px-4 py-3 text-center font-medium">Escalation To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rule.escalationLevels.map((level, levelIndex) => (
                        <tr key={level.level} className="border-t">
                          {levelIndex === 0 && (
                            <td className="border-r px-4 py-3 font-medium" rowSpan={rule.escalationLevels.length}>
                              {rule.categoryType}
                            </td>
                          )}
                          <td className="border-r px-4 py-3 text-center">{level.level}</td>
                          <td className="px-4 py-3 text-center">{level.escalationTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
