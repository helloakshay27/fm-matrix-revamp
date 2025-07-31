
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ticketManagementAPI, OperationalDay, UserAccountResponse } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Upload, Download } from 'lucide-react';

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:15`, `${hour}:30`, `${hour}:45`];
}).flat();

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 
  'friday', 'saturday', 'sunday'
];

export const OperationalDaysTab: React.FC = () => {
  const [schedule, setSchedule] = useState<OperationalDay[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null);

  useEffect(() => {
    loadUserAccount();
    fetchOperationalDays();
  }, []);

  const loadUserAccount = async () => {
    try {
      const account = await ticketManagementAPI.getUserAccount();
      setUserAccount(account);
    } catch (error) {
      console.error('Error loading user account:', error);
      toast.error('Failed to load user account');
    }
  };

  const fetchOperationalDays = async () => {
    setIsLoading(true);
    try {
      const data = await ticketManagementAPI.getOperationalDays();
      const operationalDays = Array.isArray(data) ? data : [];
      
      // Ensure all days of the week are represented
      const completeSchedule = daysOfWeek.map(day => {
        const existingDay = operationalDays.find(d => d.dayofweek === day);
        return existingDay || {
          id: 0,
          dayofweek: day,
          start_hour: 9,
          start_min: 0,
          end_hour: 17,
          end_min: 0,
          is_open: false,
          active: true,
        };
      });
      
      setSchedule(completeSchedule);
    } catch (error) {
      toast.error('Failed to fetch operational days');
      console.error('Error fetching operational days:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDay = (index: number, field: keyof OperationalDay, value: boolean | string | number) => {
    const updated = schedule.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    );
    setSchedule(updated);
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', timeString: string) => {
    const [hour, min] = timeString.split(':').map(Number);
    const updated = schedule.map((day, i) =>
      i === index ? { 
        ...day, 
        [`${field}_hour`]: hour,
        [`${field}_min`]: min || 0
      } : day
    );
    setSchedule(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ensure user account is loaded to get site_id
      if (!userAccount) {
        await loadUserAccount();
      }

      // Get site_id from user account API response
      const siteId = userAccount?.site_id?.toString();
      
      if (!siteId) {
        toast.error('Unable to determine site ID from user account. Please refresh and try again.');
        return;
      }

      await ticketManagementAPI.updateOperationalDays(siteId, schedule);
      toast.success('Operational days saved successfully!');
    } catch (error) {
      toast.error('Failed to save operational days');
      console.error('Error saving operational days:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const blob = await ticketManagementAPI.downloadSampleFile();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'operational_import.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Sample file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download sample file');
      console.error('Error downloading sample file:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      await ticketManagementAPI.uploadOperationalFile(uploadFile);
      toast.success('File uploaded successfully!');
      setImportDialogOpen(false);
      setUploadFile(null);
      fetchOperationalDays();
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Error uploading file:', error);
    }
  };

  const formatTime = (hour: number, min: number) => {
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  const capitalizeDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Operational Days Setup</span>
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Operational Days</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Button onClick={handleDownloadSample} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample Format
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload File</label>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button onClick={handleFileUpload} className="w-full">
                    Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading operational days...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((daySchedule, index) => (
                <div key={daySchedule.dayofweek} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={daySchedule.is_open}
                      onCheckedChange={(checked) => updateDay(index, 'is_open', !!checked)}
                    />
                    <label className="font-medium">{capitalizeDay(daySchedule.dayofweek)}</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Select
                      value={formatTime(daySchedule.start_hour, daySchedule.start_min)}
                      onValueChange={(value) => handleTimeChange(index, 'start', value)}
                      disabled={!daySchedule.is_open}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <Select
                      value={formatTime(daySchedule.end_hour, daySchedule.end_min)}
                      onValueChange={(value) => handleTimeChange(index, 'end', value)}
                      disabled={!daySchedule.is_open}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-gray-500">
                    {daySchedule.is_open ? 
                      `${formatTime(daySchedule.start_hour, daySchedule.start_min)} - ${formatTime(daySchedule.end_hour, daySchedule.end_min)}` : 
                      'Not operational'
                    }
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-20"
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
