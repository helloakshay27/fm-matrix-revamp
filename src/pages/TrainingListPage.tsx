
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter, Download } from 'lucide-react';

export const TrainingListPage = () => {
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Training data submitted:', formData);
    // Handle form submission
  };

  const handleReset = () => {
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training List</h1>
          <p className="text-gray-600">Manage safety training records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Training Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="srNo">Sr No</Label>
                <Input
                  id="srNo"
                  type="text"
                  placeholder="Enter Sr No"
                  value={formData.srNo}
                  onChange={(e) => handleInputChange('srNo', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="typeOfUser">Type of User</Label>
                <Select value={formData.typeOfUser} onValueChange={(value) => handleInputChange('typeOfUser', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSO">SSO</SelectItem>
                    <SelectItem value="Signin">Signin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company / Employer Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empId">Emp ID (Number)</Label>
                <Input
                  id="empId"
                  type="number"
                  placeholder="Enter Employee ID"
                  value={formData.empId}
                  onChange={(e) => handleInputChange('empId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="function">Function</Label>
                <Input
                  id="function"
                  type="text"
                  placeholder="Enter Function"
                  value={formData.function}
                  onChange={(e) => handleInputChange('function', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Enter Role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cluster">Cluster</Label>
                <Input
                  id="cluster"
                  type="text"
                  placeholder="Enter Cluster"
                  value={formData.cluster}
                  onChange={(e) => handleInputChange('cluster', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="circle">Circle</Label>
                <Input
                  id="circle"
                  type="text"
                  placeholder="Enter Circle"
                  value={formData.circle}
                  onChange={(e) => handleInputChange('circle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location</Label>
                <Input
                  id="workLocation"
                  type="text"
                  placeholder="Enter Work Location"
                  value={formData.workLocation}
                  onChange={(e) => handleInputChange('workLocation', e.target.value)}
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainingName">Training Name</Label>
                <Input
                  id="trainingName"
                  type="text"
                  placeholder="Enter Training Name"
                  value={formData.trainingName}
                  onChange={(e) => handleInputChange('trainingName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeOfTraining">Type of Training Selected</Label>
                <Select value={formData.typeOfTraining} onValueChange={(value) => handleInputChange('typeOfTraining', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Training Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainingDate">Training Date</Label>
                <MaterialDatePicker
                  value={formData.trainingDate}
                  onChange={(value) => handleInputChange('trainingDate', value)}
                  placeholder="Select Training Date"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="px-8"
              >
                Reset
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:opacity-90 px-8"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Training Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Sr No</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">User Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Full Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Mobile</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Company</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Training Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Training Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Training Date</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={10} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                    No training records found. Add a new training record to get started.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
