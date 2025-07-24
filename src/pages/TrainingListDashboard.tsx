
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrainingRecord {
  id: string;
  srNo: number;
  typeOfUser: 'SSO' | 'Signin';
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
  typeOfTraining: 'Internal' | 'External';
  trainingDate: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
}

const mockTrainingData: TrainingRecord[] = [
  {
    id: '1',
    srNo: 1,
    typeOfUser: 'SSO',
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    mobileNumber: '+1234567890',
    companyName: 'ABC Corp',
    empId: 'EMP001',
    function: 'Engineering',
    role: 'Safety Manager',
    cluster: 'North',
    circle: 'Circle A',
    workLocation: 'Office Building A',
    trainingName: 'Fire Safety Training',
    typeOfTraining: 'Internal',
    trainingDate: '2025-01-15',
    status: 'Completed'
  },
  {
    id: '2',
    srNo: 2,
    typeOfUser: 'Signin',
    fullName: 'Jane Smith',
    email: 'jane.smith@company.com',
    mobileNumber: '+1234567891',
    companyName: 'XYZ Ltd',
    empId: 'EMP002',
    function: 'Operations',
    role: 'Safety Officer',
    cluster: 'South',
    circle: 'Circle B',
    workLocation: 'Factory Unit 1',
    trainingName: 'Emergency Response Training',
    typeOfTraining: 'External',
    trainingDate: '2025-01-20',
    status: 'In Progress'
  }
];

export const TrainingListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingData, setTrainingData] = useState<TrainingRecord[]>(mockTrainingData);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'Scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredData = trainingData.filter(record =>
    record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.trainingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Training List</h1>
          <p className="text-gray-600">Manage safety training records</p>
        </div>
        <Button 
          onClick={() => navigate('/safety/training-list/add')}
          className="bg-[#C72030] hover:bg-[#A01020]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Training Record
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, training, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training Records ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Emp ID</TableHead>
                <TableHead>Training Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Training Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.srNo}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.fullName}</div>
                      <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.companyName}</TableCell>
                  <TableCell>{record.empId}</TableCell>
                  <TableCell>{record.trainingName}</TableCell>
                  <TableCell>
                    <Badge variant={record.typeOfTraining === 'Internal' ? 'default' : 'secondary'}>
                      {record.typeOfTraining}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.trainingDate}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/safety/training-list/${record.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/safety/training-list/edit/${record.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
