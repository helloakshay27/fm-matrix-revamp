
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface EmployeeData {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  userType: string;
}

export const EmployeesDashboard = () => {
  const navigate = useNavigate();
  const [employees] = useState<EmployeeData[]>([
    {
      id: '220274',
      employeeId: '9556',
      firstName: 'Test',
      lastName: 'Bulk',
      email: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
      mobile: '9774545411',
      userType: 'User'
    },
    {
      id: '218970',
      employeeId: '',
      firstName: 'Vinayak',
      lastName: 'test wallet',
      email: 'test200@yopmail.com',
      mobile: '8642589677',
      userType: 'User'
    },
    {
      id: '212919',
      employeeId: '',
      firstName: 'sameer',
      lastName: 'kumar',
      email: '2134513211@gmail.com',
      mobile: '2134513211',
      userType: 'Admin'
    },
    {
      id: '208268',
      employeeId: '62376',
      firstName: 'Demo',
      lastName: 'User',
      email: 'akksjs121@akks.com',
      mobile: '4982738492',
      userType: 'User'
    },
    {
      id: '206726',
      employeeId: '',
      firstName: 'Test',
      lastName: '1000',
      email: 'test5999@yopmail.com',
      mobile: '8811881188',
      userType: 'Admin'
    },
    {
      id: '206725',
      employeeId: '',
      firstName: 'Test',
      lastName: '999.0',
      email: 'test5998@yopmail.com',
      mobile: '4618220262',
      userType: 'User'
    },
    {
      id: '206722',
      employeeId: '',
      firstName: 'Test',
      lastName: '996.',
      email: 'test5995@yopmail.com',
      mobile: '4618220259',
      userType: 'User'
    },
    {
      id: '206720',
      employeeId: '',
      firstName: 'Test',
      lastName: '994.0',
      email: 'test5993@yopmail.com',
      mobile: '4618220257',
      userType: 'Admin'
    }
  ]);

  const handleAddClick = () => {
    navigate('/vas/space-management/setup/employees/add');
  };

  const handleViewClick = (employee: EmployeeData) => {
    navigate(`/vas/space-management/setup/employees/details/${employee.id}`);
  };

  const handleEditClick = (employee: EmployeeData) => {
    navigate(`/vas/space-management/setup/employees/edit/${employee.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Employees</div>
          <h1 className="text-2xl font-bold text-gray-800">EMPLOYEES</h1>
        </div>

        {/* Table */}
        <EnhancedTable
          data={employees}
          columns={[
            { key: "actions", label: "Actions", sortable: false, draggable: false, defaultVisible: true, hideable: false },
            { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
            { key: "employeeId", label: "Employee ID", sortable: true, draggable: true, defaultVisible: true },
            { key: "firstName", label: "First Name", sortable: true, draggable: true, defaultVisible: true },
            { key: "lastName", label: "Last Name", sortable: true, draggable: true, defaultVisible: true },
            { key: "email", label: "Email Address", sortable: true, draggable: true, defaultVisible: true },
            { key: "mobile", label: "Mobile No.", sortable: true, draggable: true, defaultVisible: true },
            { key: "userType", label: "User Type", sortable: true, draggable: true, defaultVisible: true },
          ] as ColumnConfig[]}
          storageKey="employees-table"
          enableSearch={true}
          pagination={true}
          pageSize={10}
          hideTableExport={true}
          emptyMessage="No employees found"
          renderCell={(item, columnKey) => {
            switch (columnKey) {
              case "actions":
                return (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => handleViewClick(item)}
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => handleEditClick(item)}
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                    </Button>
                  </div>
                );
              case "id":
                return <span className="text-blue-600">{item.id}</span>;
              case "email":
                return <span className="text-blue-600 max-w-xs truncate block">{item.email}</span>;
              default:
                return item[columnKey as keyof EmployeeData] as React.ReactNode;
            }
          }}
          leftActions={
            <Button
              onClick={handleAddClick}
             className="fm-button-fix fm-button-brand px-4 py-2"
          variant="ghost"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          }
        />
      </div>
    </div>
  );
};
