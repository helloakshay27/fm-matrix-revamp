import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings } from 'lucide-react';

interface SurveyAnalyticsSelectorProps {
    onSelectionChange: (selectedTypes: string[]) => void;
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    selectedOptions?: string[];
}

const analyticsOptions = [
    { id: 'surveyStatistics', label: 'Survey Statistics', description: 'Overview of survey metrics' },
    { id: 'statusDistribution', label: 'Status Distribution', description: 'Active, expired, and pending surveys' },
    { id: 'surveyDistributions', label: 'Type Distribution', description: 'Survey type breakdown' },
    { id: 'categoryWise', label: 'Category Analysis', description: 'Category-wise survey distribution' },
    { id: 'typeWise', label: 'Type Analysis', description: 'Type-wise survey distribution' },
];

export const SurveyAnalyticsSelector: React.FC<SurveyAnalyticsSelectorProps> = ({
    onSelectionChange,
    dateRange,
    selectedOptions = ['statusDistribution', 'surveyDistributions', 'categoryWise', 'typeWise'],
}) => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>(selectedOptions);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectionChange = (optionId: string, checked: boolean) => {
        let newSelection: string[];
        if (checked) {
            newSelection = [...selectedTypes, optionId];
        } else {
            newSelection = selectedTypes.filter(id => id !== optionId);
        }
        setSelectedTypes(newSelection);
        onSelectionChange(newSelection);
    };

    const handleSelectAll = () => {
        const allOptions = analyticsOptions.map(option => option.id);
        setSelectedTypes(allOptions);
        onSelectionChange(allOptions);
    };

    const handleDeselectAll = () => {
        setSelectedTypes([]);
        onSelectionChange([]);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Analytics ({selectedTypes.length})
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Select Analytics</h4>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSelectAll}
                                className="text-xs"
                            >
                                Select All
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDeselectAll}
                                className="text-xs"
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {analyticsOptions.map((option) => (
                            <div key={option.id} className="flex items-start space-x-3">
                                <Checkbox
                                    id={option.id}
                                    checked={selectedTypes.includes(option.id)}
                                    onCheckedChange={(checked) => 
                                        handleSelectionChange(option.id, checked as boolean)
                                    }
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={option.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
