
import React from 'react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Printer } from 'lucide-react';

// Sample data matching the staff dashboard
const allStaffsData = [
  {
    id: '38969',
    name: 'Avdesh Tiwari',
    unit: '512',
    department: 'Operations',
    email: 'avdesh.tiwari@example.com',
    mobile: '9987654390',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    createdOn: '01/07/2023',
    checkIn: null,
    checkOut: null,
    isIn: false,
    staffId: '',
    profileImage: '/placeholder.svg'
  },
  {
    id: '37764',
    name: 'Avdesh Tiwari',
    unit: 'HELP DESK',
    department: 'HR',
    email: 'avdesh.tiwari@vodafoneidea.com',
    mobile: '9876567665',
    workType: 'Vendor',
    vendorName: 'Tech Solutions',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    createdOn: '01/07/2023',
    checkIn: '28/07/2023 3:47 PM',
    checkOut: '28/07/2023 3:48 PM',
    isIn: true,
    staffId: 'EMP001',
    profileImage: '/placeholder.svg'
  },
  {
    id: '37143',
    name: 'Sohail Ansari',
    unit: 'HELP DESK',
    department: 'Operations',
    email: 'sohail.ansari@example.com',
    mobile: '7715088437',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    createdOn: '01/07/2023',
    checkIn: '28/07/2023 3:45 PM',
    checkOut: '28/07/2023 3:47 PM',
    isIn: true,
    staffId: 'EMP002',
    profileImage: '/placeholder.svg'
  },
  {
    id: '36954',
    name: 'Chandan Kumar',
    unit: 'Reception',
    department: 'ACCOUNTS',
    email: 'chandanthakur22988@gmail.com',
    mobile: '8489599800',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validFrom: '26/03/2024',
    validTill: '05/04/2024',
    createdOn: '01/07/2023',
    checkIn: null,
    checkOut: null,
    isIn: false,
    staffId: 'EMP003',
    profileImage: '/placeholder.svg'
  }
];

// Sample visit schedule data
const visitSchedule = [
  { day: 'Monday', time: '00:00 to 00:00' },
  { day: 'Tuesday', time: '13:00 to 15:00' },
  { day: 'Wednesday', time: '00:00 to 00:00' },
  { day: 'Thursday', time: '00:00 to 00:00' },
  { day: 'Friday', time: '00:00 to 00:00' },
  { day: 'Saturday', time: '00:00 to 00:00' },
  { day: 'Sunday', time: '00:00 to 00:00' }
];

export const StaffDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the staff member by ID
  const staff = allStaffsData.find(s => s.id === id);

  if (!staff) {
    return (
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Staff Not Found</h2>
          <Button onClick={() => navigate('/security/staff')}>
            Back to Staff List
          </Button>
        </div>
      </div>
    );
  }

  const handleVerifyNumber = () => {
    console.log('Verifying number for staff:', staff.id);
  };

  const handleEdit = () => {
    console.log('Edit staff:', staff.id);
  };

  const handlePrint = () => {
    console.log('Print QR code for staff:', staff.id);
    window.print();
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button 
          onClick={() => navigate('/security/staff')}
          className="text-blue-600 hover:underline"
        >
          Visitor
        </button>
        <span>&gt;</span>
        <span>Visitor Details</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 uppercase">VISITOR DETAILS</h1>
          <div className="flex gap-3">
            <Button
              onClick={handleVerifyNumber}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-4 py-2"
            >
              Verify Number
            </Button>
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
            >
              <Edit className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-bold">9</span>
                </div>
                <h2 className="text-lg font-semibold text-orange-500 uppercase">BASIC INFORMATION</h2>
              </div>

              <div className="flex items-start gap-6 mb-8">
                <img 
                  src={staff.profileImage} 
                  alt="Staff profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="text-blue-600">{staff.email}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Vendor Name</label>
                        <p>{staff.vendorName || ':'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Staff Id</label>
                        <p>{staff.staffId || ':'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Valid From</label>
                        <p>{staff.validFrom}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Created on</label>
                        <p>{staff.createdOn}</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Status</label>
                        <p>{staff.status || ':'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Department</label>
                        <p>{staff.department || ':'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Work Type</label>
                        <p>{staff.workType}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600">Valid Till</label>
                        <p>{staff.validTill}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Information */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-sm font-bold">▼</span>
                  </div>
                  <h2 className="text-lg font-semibold text-orange-500 uppercase">VISIT INFORMATION</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center font-semibold border-b border-gray-300 pb-2">Day</div>
                    <div className="text-center font-semibold border-b border-gray-300 pb-2">Time</div>
                    {visitSchedule.map((schedule, index) => (
                      <React.Fragment key={index}>
                        <div className="text-center py-2 border-b border-gray-200">
                          {schedule.day}
                        </div>
                        <div className="text-center py-2 border-b border-gray-200 text-blue-600">
                          {schedule.time}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-bold">⚏</span>
                </div>
                <h2 className="text-lg font-semibold text-orange-500 uppercase">QR CODE</h2>
              </div>

              <div className="text-center">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-4">
                  <div className="w-48 h-48 mx-auto bg-black" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0h10v10H0zM20 0h10v10H20zM40 0h10v10H40zM60 0h10v10H60zM80 0h10v10H80zM0 20h10v10H0zM80 20h10v10H80zM0 40h10v10H0zM20 40h10v10H20zM40 40h10v10H40zM60 40h10v10H60zM80 40h10v10H80zM0 60h10v10H0zM80 60h10v10H80zM0 80h10v10H0zM20 80h10v10H20zM40 80h10v10H40zM60 80h10v10H60zM80 80h10v10H80z' fill='black'/%3E%3C/svg%3E")`,
                    backgroundSize: 'cover'
                  }}>
                  </div>
                </div>
                <Button
                  onClick={handlePrint}
                  className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2 flex items-center gap-2 mx-auto"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-600">
            Powered by <span className="font-semibold">Pivotal.work</span>
          </p>
        </div>
      </div>
    </div>
  );
};
