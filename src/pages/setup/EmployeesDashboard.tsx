import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface EmployeeData {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  userType: string;
}

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'employeeId', label: 'Employee ID', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'firstName', label: 'First Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'lastName', label: 'Last Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'email', label: 'Email Address', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'mobile', label: 'Mobile No.', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'userType', label: 'User Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
];

export const EmployeesDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees] = useState<EmployeeData[]>([
    {
      id: '220274',
      employeeId: '9556',
      firstName: 'Test',
      lastName: 'Bulk',
      email:
        'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
      mobile: '9774545411',
      userType: 'User',
    },
    {
      id: '218970',
      employeeId: '',
      firstName: 'Vinayak',
      lastName: 'test wallet',
      email: 'test200@yopmail.com',
      mobile: '8642589677',
      userType: 'User',
    },
    {
      id: '212919',
      employeeId: '',
      firstName: 'sameer',
      lastName: 'kumar',
      email: '2134513211@gmail.com',
      mobile: '2134513211',
      userType: 'Admin',
    },
    {
      id: '208268',
      employeeId: '62376',
      firstName: 'Demo',
      lastName: 'User',
      email: 'akksjs121@akks.com',
      mobile: '4982738492',
      userType: 'User',
    },
    {
      id: '206726',
      employeeId: '',
      firstName: 'Test',
      lastName: '1000',
      email: 'test5999@yopmail.com',
      mobile: '8811881188',
      userType: 'Admin',
    },
    {
      id: '206725',
      employeeId: '',
      firstName: 'Test',
      lastName: '999.0',
      email: 'test5998@yopmail.com',
      mobile: '4618220262',
      userType: 'User',
    },
    {
      id: '206722',
      employeeId: '',
      firstName: 'Test',
      lastName: '996.',
      email: 'test5995@yopmail.com',
      mobile: '4618220259',
      userType: 'User',
    },
    {
      id: '206720',
      employeeId: '',
      firstName: 'Test',
      lastName: '994.0',
      email: 'test5993@yopmail.com',
      mobile: '4618220257',
      userType: 'Admin',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const q = searchTerm.toLowerCase();
    return employees.filter((employee) =>
      Object.values(employee).some((value) =>
        String(value ?? '').toLowerCase().includes(q)
      )
    );
  }, [employees, searchTerm]);

  const handleAddClick = () => {
    navigate('/vas/space-management/setup/employees/add');
  };

  const handleViewClick = (employee: EmployeeData) => {
    navigate(`/vas/space-management/setup/employees/details/${employee.id}`);
  };

  const handleEditClick = (employee: EmployeeData) => {
    navigate(`/vas/space-management/setup/employees/edit/${employee.id}`);
  };

  const renderCell = (item: EmployeeData, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium text-gray-900">{item.id}</span>;
      case 'employeeId':
        return item.employeeId || '--';
      case 'email':
        return (
          <span className="block max-w-[220px] truncate text-gray-900" title={item.email}>
            {item.email}
          </span>
        );
      default:
        return item[columnKey as keyof EmployeeData] || '--';
    }
  };

  const renderActions = (item: EmployeeData) => (
    <div className="flex items-center justify-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => handleViewClick(item)}
        title="View"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => handleEditClick(item)}
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">
      <div className="flex-1 min-w-0 p-6 w-full max-w-full">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Employees</div>
          <h1 className="text-2xl font-bold text-gray-800">EMPLOYEES</h1>
        </div>

        <div className="w-full min-w-0 max-w-full">
          <EnhancedTable
            data={filteredData}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="employees-table-v2"
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            disableClientSearch
            searchPlaceholder="Search..."
            pagination
            pageSize={10}
            hideTableExport
            emptyMessage="No employees found"
            loading={loading}
            leftActions={
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAddClick}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap [&_svg]:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
