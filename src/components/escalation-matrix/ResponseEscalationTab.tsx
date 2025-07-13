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
import { ESCALATION_LEVELS, PRIORITY_LEVELS, ESCALATION_TO_OPTIONS, ResponseEscalationRule, EscalationLevel, PriorityTiming } from '@/types/escalationMatrix';

const responseEscalationSchema = z.object({
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

type ResponseEscalationFormData = z.infer<typeof responseEscalationSchema>;

export const ResponseEscalationTab: React.FC = () => {
  const [rules, setRules] = useState<ResponseEscalationRule[]>([]);
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

  const form = useForm<ResponseEscalationFormData>({
    resolver: zodResolver(responseEscalationSchema),
    defaultValues: {
      categoryType: '',
      escalationLevels: createDefaultEscalationLevels(),
      priorityTimings: createDefaultPriorityTimings(),
    },
  });

  const handleSubmit = (data: ResponseEscalationFormData) => {
    const newRule: ResponseEscalationRule = {
      id: Date.now().toString(),
      categoryType: data.categoryType,
      escalationLevels: data.escalationLevels,
      priorityTimings: data.priorityTimings,
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

  const filteredRules = selectedCategoryFilter 
    ? rules.filter(rule => rule.categoryType === selectedCategoryFilter)
    : rules;

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create Response Escalation Rule</CardTitle>
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
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Cleaning">Cleaning</SelectItem>
                            <SelectItem value="IT Support">IT Support</SelectItem>
                            <SelectItem value="Facilities">Facilities</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Escalation Levels Grid */}
              <div>
                <h3 className="text-lg font-medium mb-4">Escalation Levels</h3>
                <div className="grid grid-cols-5 gap-4">
                  {ESCALATION_LEVELS.map((level, index) => (
                    <div key={level}>
                      <FormField
                        control={form.control}
                        name={`escalationLevels.${index}.escalationTo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{level}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Escalation To" />
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Timings Grid */}
              <div>
                <h3 className="text-lg font-medium mb-4">Priority Timings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-muted text-left">Priority</th>
                        {ESCALATION_LEVELS.map(level => (
                          <th key={level} className="border p-2 bg-muted text-center">{level}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PRIORITY_LEVELS.map((priority, priorityIndex) => (
                        <tr key={priority}>
                          <td className="border p-2 font-medium">{priority}</td>
                          {ESCALATION_LEVELS.map(level => (
                            <td key={level} className="border p-2">
                              <div className="flex gap-1">
                                <FormField
                                  control={form.control}
                                  name={`priorityTimings.${priorityIndex}.days`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="D"
                                          className="w-12 h-8 text-xs"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`priorityTimings.${priorityIndex}.hours`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="H"
                                          className="w-12 h-8 text-xs"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`priorityTimings.${priorityIndex}.minutes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="M"
                                          className="w-12 h-8 text-xs"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Category Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Cleaning">Cleaning</SelectItem>
            <SelectItem value="IT Support">IT Support</SelectItem>
            <SelectItem value="Facilities">Facilities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Existing Rules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Response Escalation Rules</h2>
        {filteredRules.length === 0 ? (
          <p className="text-muted-foreground">No rules found. Create your first rule above.</p>
        ) : (
          filteredRules.map(rule => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{rule.categoryType}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(rule.createdOn).toLocaleDateString()} by {rule.createdBy}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                </div>
              </CardHeader>
              {expandedRules.has(rule.id) && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Escalation Levels</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {rule.escalationLevels.map(level => (
                          <div key={level.level} className="text-sm">
                            <strong>{level.level}:</strong> {level.escalationTo}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Priority Timings</h4>
                      <div className="space-y-1">
                        {rule.priorityTimings.map(timing => (
                          <div key={timing.priority} className="text-sm">
                            <strong>{timing.priority}:</strong> {timing.days}d {timing.hours}h {timing.minutes}m
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
