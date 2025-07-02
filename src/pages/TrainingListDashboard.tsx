
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Filter, Search } from "lucide-react";
import { MaterialDatePicker } from "@/components/ui/material-date-picker";
import { useToast } from "@/hooks/use-toast";

interface TrainingRecord {
  id: number;
  srNo: string;
  typeOfUser: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  empId: string;
  function: string;
  role: string;
  cluster: string;
  circle: string;
  workLocation: string;
  trainingName: string;
  typeOfTraining: string;
  trainingDate: string;
}

export const TrainingListDashboard = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  
  const [formData, setFormData] = useState({
    srNo: '',
    typeOfUser: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    empId: '',
    function: '',
    role: '',
    cluster: '',
    circle: '',
    workLocation: '',
    trainingName: '',
    typeOfTraining: '',
    trainingDate: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate Sr No if not provided
    const srNo = formData.srNo || (trainingRecords.length + 1).toString();
    
    const newRecord: TrainingRecord = {
      id: Date.now(),
      srNo,
      ...formData
    };

    setTrainingRecords([...trainingRecords, newRecord]);
    
    // Reset form
    setFormData({
      srNo: '',
      typeOfUser: '',
      fullName: '',
      email: '',
      mobileNumber: '',
      companyName: '',
      empId: '',
      function: '',
      role: '',
      cluster: '',
      circle: '',
      workLocation: '',
      trainingName: '',
      typeOfTraining: '',
      trainingDate: ''
    });
    
    setShowAddForm(false);
    
    toast({
      title: "Training record added successfully",
      className: "bg-green-500 text-white border-green-500",
    });
  };

  const filteredRecords = trainingRecords.filter(record =>
    record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.trainingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Safety &gt; Training List</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">TRAINING LIST</h1>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search training records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" style={{ color: '#BF213E' }} />
          Add Training Record
        </Button>
        <Button variant="outline" className="border-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Training Record</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="srNo">Sr No</Label>
                <Input
                  id="srNo"
                  value={formData.srNo}
                  onChange={(e) => handleInputChange('srNo', e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div>
                <Label htmlFor="typeOfUser">Type of User</Label>
                <Select onValueChange={(value) => handleInputChange('typeOfUser', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSO">SSO</SelectItem>
                    <SelectItem value="Signin">Signin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="companyName">Company / Employer Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="empId">Emp ID (Number)</Label>
                <Input
                  id="empId"
                  type="number"
                  value={formData.empId}
                  onChange={(e) => handleInputChange('empId', e.target.value)}
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              <div>
                <Label htmlFor="function">Function</Label>
                <Input
                  id="function"
                  value={formData.function}
                  onChange={(e) => handleInputChange('function', e.target.value)}
                  placeholder="Enter function"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Enter role"
                />
              </div>

              <div>
                <Label htmlFor="cluster">Cluster</Label>
                <Input
                  id="cluster"
                  value={formData.cluster}
                  onChange={(e) => handleInputChange('cluster', e.target.value)}
                  placeholder="Enter cluster"
                />
              </div>

              <div>
                <Label htmlFor="circle">Circle</Label>
                <Input
                  id="circle"
                  value={formData.circle}
                  onChange={(e) => handleInputChange('circle', e.target.value)}
                  placeholder="Enter circle"
                />
              </div>

              <div>
                <Label htmlFor="workLocation">Work Location</Label>
                <Input
                  id="workLocation"
                  value={formData.workLocation}
                  onChange={(e) => handleInputChange('workLocation', e.target.value)}
                  placeholder="Enter work location"
                  required
                />
              </div>

              <div>
                <Label htmlFor="trainingName">Training Name</Label>
                <Input
                  id="trainingName"
                  value={formData.trainingName}
                  onChange={(e) => handleInputChange('trainingName', e.target.value)}
                  placeholder="Enter training name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="typeOfTraining">Type of Training Selected</Label>
                <Select onValueChange={(value) => handleInputChange('typeOfTraining', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select training type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trainingDate">Training Date</Label>
                <MaterialDatePicker
                  value={formData.trainingDate}
                  onChange={(value) => handleInputChange('trainingDate', value)}
                  placeholder="Select training date"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                Add Record
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Sr No</TableHead>
              <TableHead className="font-semibold">Type of User</TableHead>
              <TableHead className="font-semibold">Full Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Mobile Number</TableHead>
              <TableHead className="font-semibold">Company Name</TableHead>
              <TableHead className="font-semibold">Emp ID</TableHead>
              <TableHead className="font-semibold">Function</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Cluster</TableHead>
              <TableHead className="font-semibold">Circle</TableHead>
              <TableHead className="font-semibold">Work Location</TableHead>
              <TableHead className="font-semibold">Training Name</TableHead>
              <TableHead className="font-semibold">Training Type</TableHead>
              <TableHead className="font-semibold">Training Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-gray-50">
                  <TableCell>{record.srNo}</TableCell>
                  <TableCell>{record.typeOfUser}</TableCell>
                  <TableCell>{record.fullName}</TableCell>
                  <TableCell>{record.email}</TableCell>
                  <TableCell>{record.mobileNumber}</TableCell>
                  <TableCell>{record.companyName}</TableCell>
                  <TableCell>{record.empId}</TableCell>
                  <TableCell>{record.function}</TableCell>
                  <TableCell>{record.role}</TableCell>
                  <TableCell>{record.cluster}</TableCell>
                  <TableCell>{record.circle}</TableCell>
                  <TableCell>{record.workLocation}</TableCell>
                  <TableCell>{record.trainingName}</TableCell>
                  <TableCell>{record.typeOfTraining}</TableCell>
                  <TableCell>{record.trainingDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-8 text-gray-500">
                  No training records found. Click "Add Training Record" to create your first record.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
