
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface MSafeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
}

export const MSafeExportModal = ({ isOpen, onClose, users }: MSafeExportModalProps) => {
  const handleExport = () => {
    // Create CSV content with all user data
    const headers = [
      'ID', 'User Name', 'Gender', 'Mobile Number', 'Email', 
      'Vendor Company Name', 'Entity Name', 'Unit', 'Role', 
      'Employee ID', 'Created By', 'Access Level', 'Type', 
      'Status', 'Active', 'Face Recognition', 'App Downloaded'
    ];

    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.userName}"`,
        user.gender,
        user.mobileNumber,
        user.email,
        user.vendorCompanyName,
        user.entityName,
        user.unit,
        user.role,
        `"${user.employeeId}"`,
        user.createdBy,
        user.accessLevel,
        user.type,
        user.status,
        user.active ? 'Yes' : 'No',
        user.faceRecognition,
        user.appDownloaded
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `m_safe_users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Export M Safe Users</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6">
            <Download className="w-12 h-12 mx-auto mb-4 text-purple-700" />
            <p className="text-gray-600 mb-4">
              Export all M Safe user data to CSV format
            </p>
            <p className="text-sm text-gray-500">
              Total records: {users.length}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
