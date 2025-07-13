
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Star, X, Plus, Minus } from 'lucide-react';

interface QuestionContentProps {
  questionType: string;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({ questionType }) => {
  const renderQuestionContent = () => {
    switch (questionType) {
      case 'Short answer':
        return (
          <div className="px-4 py-6">
            <div className="text-gray-400 text-sm">
              Short-answer text
            </div>
          </div>
        );

      case 'Paragraph':
        return (
          <div className="px-4 py-6">
            <div className="text-gray-400 text-sm">
              Long-answer text
            </div>
          </div>
        );

      case 'Multiple choice':
        return (
          <div className="px-4 py-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              <Input value="Option 1" className="flex-1 border-none p-0 focus-visible:ring-0" />
              <Button variant="ghost" size="sm" className="p-1">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              <Input value="Option 2" className="flex-1 border-none p-0 focus-visible:ring-0" />
              <Button variant="ghost" size="sm" className="p-1">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              <span className="text-gray-400">Add Option or "Other"</span>
            </div>
          </div>
        );

      case 'Checkboxes':
        return (
          <div className="px-4 py-6 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox />
              <Input value="Option 1" className="flex-1 border-none p-0 focus-visible:ring-0" />
              <Button variant="ghost" size="sm" className="p-1">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox />
              <Input value="Option 2" className="flex-1 border-none p-0 focus-visible:ring-0" />
              <Button variant="ghost" size="sm" className="p-1">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox />
              <span className="text-gray-400">Add Option or "Other"</span>
            </div>
          </div>
        );

      case 'Dropdown':
        return (
          <div className="px-4 py-6 space-y-3">
            <div className="text-sm">1. Option 1</div>
            <div className="text-sm">2. Option 2</div>
          </div>
        );

      case 'File Upload':
        return (
          <div className="px-4 py-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm">Allow only specific file types</span>
              <Switch />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Spreadsheet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Video</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Presentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Drawing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Image</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Audio</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Maximum number of files</span>
                <Select defaultValue="5">
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Maximum file size</span>
                <Select defaultValue="10MB">
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1MB">1 MB</SelectItem>
                    <SelectItem value="10MB">10 MB</SelectItem>
                    <SelectItem value="100MB">100 MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'Linear scale':
        return (
          <div className="px-4 py-6 space-y-4">
            <div className="flex items-center gap-4">
              <Select defaultValue="1">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm">to</span>
              <Select defaultValue="5">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">1. Label(Optional)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">5. Label(Optional)</span>
              </div>
            </div>
          </div>
        );

      case 'Rating':
        return (
          <div className="px-4 py-6 space-y-4">
            <div className="flex items-center gap-4">
              <Select defaultValue="5">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="star">
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="star">⭐</SelectItem>
                  <SelectItem value="heart">❤️</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="text-center">
                  <div className="text-sm mb-1">{num}</div>
                  <Star className="w-6 h-6 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'Multiple choice grid':
        return (
          <div className="px-4 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="font-medium text-sm mb-2">Rows</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">1. Row 1</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">2. Row 2</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">3. Add row</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-sm mb-2">Columns</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm">Column 1</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-400">Add Column</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm">Require a response in each row</span>
                <Switch />
              </div>
            </div>
          </div>
        );

      case 'Tick box grid':
        return (
          <div className="px-4 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="font-medium text-sm mb-2">Rows</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">1. Row 1</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">2. Row 2</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">3. Add row</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-sm mb-2">Columns</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-sm">Column 1</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-sm text-gray-400">Add Column</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm">Require a response in each row</span>
                <Switch />
              </div>
            </div>
          </div>
        );

      case 'Date':
        return (
          <div className="px-4 py-6">
            <div className="text-gray-400 text-sm">
              Date picker will be shown here
            </div>
          </div>
        );

      case 'Time':
        return (
          <div className="px-4 py-6">
            <div className="text-gray-400 text-sm">
              Time picker will be shown here
            </div>
          </div>
        );

      default:
        return (
          <div className="px-4 py-6">
            <div className="text-gray-400 text-sm">
              {questionType} text
            </div>
          </div>
        );
    }
  };

  return renderQuestionContent();
};
