import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockModule } from '@/services/moduleService';

interface ModuleDetailCardProps {
  module: LockModule;
}

export const ModuleDetailCard = ({ module }: ModuleDetailCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{module.name}</span>
          <Badge variant={module.active ? "default" : "secondary"}>
            {module.active ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription>
          {module.show_name} ({module.abbreviation})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Module ID:</strong> {module.id}
            </div>
            <div>
              <strong>Phase ID:</strong> {module.phase_id}
            </div>
            <div>
              <strong>Created:</strong> {module.created_at ? new Date(module.created_at).toLocaleDateString() : '-'}
            </div>
            <div>
              <strong>Updated:</strong> {module.updated_at ? new Date(module.updated_at).toLocaleDateString() : '-'}
            </div>
          </div>

          {/* Functions */}
          {module.lock_functions && module.lock_functions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Functions ({module.lock_functions.length})</h4>
              <div className="space-y-2">
                {module.lock_functions.map((func) => (
                  <div key={func.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{func.name}</span>
                      <Badge variant={func.active ? "default" : "secondary"} className="text-xs">
                        {func.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Action: <code className="bg-gray-200 px-1 rounded">{func.action_name}</code>
                    </div>
                    
                    {/* Sub Functions */}
                    {func.lock_sub_functions && func.lock_sub_functions.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-medium mb-1">Sub-functions:</div>
                        <div className="flex flex-wrap gap-1">
                          {func.lock_sub_functions.map((subFunc) => (
                            <Badge 
                              key={subFunc.id} 
                              variant="outline" 
                              className={`text-xs ${subFunc.active ? '' : 'opacity-50'}`}
                            >
                              {subFunc.sub_function_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
