import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronDown, Edit, Trash2 } from 'lucide-react';
import { ESCALATION_LEVELS, ESCALATION_TO_OPTIONS, ResolutionEscalationRule, EscalationLevel } from '@/types/escalationMatrix';

const resolutionEscalationSchema = z.object({
  categoryType: z.string().min(1, 'Category type is required'),
  escalationLevels: z.array(z.object({
    id: z.string(),
    level: z.enum(['E1', 'E2', 'E3', 'E4', 'E5']),
    escalationTo: z.string().min(1, 'Escalation to is required'),
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

  const form = useForm<ResolutionEscalationFormData>({
    resolver: zodResolver(resolutionEscalationSchema),
    defaultValues: {
      categoryType: '',
      escalationLevels: createDefaultEscalationLevels(),
    },
  });

  const handleSubmit = (data: ResolutionEscalationFormData) => {
    const newRule: ResolutionEscalationRule = {
      id: Date.now().toString(),
      categoryType: data.categoryType,
      escalationLevels: data.escalationLevels,
      createdOn: new Date().toISOString(),
      createdBy: 'Current User',
      active: true,
    };

    setRules(prev => [...prev, newRule]);
    form.reset({
      categoryType: '',
      escalationLevels: createDefaultEscalationLevels(),
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
        <h2 className="text-xl font-semibold">Existing Resolution Escalation Rules</h2>
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
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
