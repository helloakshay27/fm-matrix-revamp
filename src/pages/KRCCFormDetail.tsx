import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for the detail view
const mockFormData = {
  1: {
    id: 1,
    personalDetails: {
      firstName: 'Sanjeev',
      lastName: 'Kumar',
      email: 'skchauhaanabc@gmail.com',
      bloodGroup: 'O+',
      gender: 'Male',
      dob: '1995-05-24'
    },
    krccDetails: {
      drivingLicenseNumber: 'TN652050072423',
      twoWheelerRegNumber: 'TN09T5685',
      validTill: '2035-10-18',
      attachments: {
        mParivahan: [
          { id: '1001904712', type: 'M-Parivahan', url: '/placeholder-doc.jpg' }
        ],
        vehicle: [
          { id: '1000693487', type: 'Vehicle', url: '/placeholder-doc.jpg' },
          { id: '1000693489', type: 'Vehicle', url: '/placeholder-doc.jpg' }
        ],
        insurance: [
          { id: '1001904699', type: 'Insurance', url: '/placeholder-doc.jpg' },
          { id: '1000693487', type: 'Insurance', url: '/placeholder-doc.jpg' },
          { id: '1001904700', type: 'Insurance', url: '/placeholder-doc.jpg' },
          { id: '1001904699', type: 'Insurance', url: '/placeholder-doc.jpg' }
        ],
        helmet: [
          { id: '1000693484', type: 'Helmet', url: '/placeholder-doc.jpg' },
          { id: '1000693489', type: 'Helmet', url: '/placeholder-doc.jpg' }
        ]
      }
    }
  }
};

interface AttachmentProps {
  attachments: Array<{
    id: string;
    type: string;
    url: string;
  }>;
  title: string;
}

const AttachmentSection: React.FC<AttachmentProps> = ({ attachments, title }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">{title}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center h-20 bg-white rounded border mb-2">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#C72030]">
                <Download className="h-3 w-3" />
                <span className="text-xs font-medium">{attachment.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const KRCCFormDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const formData = mockFormData[id as '1'] || mockFormData['1'];

  if (!formData) {
    return <div>Form not found</div>;
  }

  const handleBack = () => {
    navigate('/maintenance/krcc-list');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">KRCC Form Details</h1>
        </div>
        <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
          Export to excel
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Personal Details Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#C72030] mb-6">Personal Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                {formData.personalDetails.firstName}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                {formData.personalDetails.lastName}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                {formData.personalDetails.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                {formData.personalDetails.gender}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                {formData.personalDetails.bloodGroup}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                {formData.personalDetails.dob}
              </div>
            </div>
          </div>
        </div>

        {/* KRCC Details Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#C72030] mb-6">KRCC Details (Ride a 2 Wheeler)</h2>
          
          {/* Driving License Details */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Driving License Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
                <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                  {formData.krccDetails.drivingLicenseNumber}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">2 Wheeler Reg. Number</label>
                <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                  {formData.krccDetails.twoWheelerRegNumber}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                  {formData.krccDetails.validTill}
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <AttachmentSection 
            title="M-Parivahan Attachments" 
            attachments={formData.krccDetails.attachments.mParivahan}
          />
          
          <AttachmentSection 
            title="Vehicle Attachments" 
            attachments={formData.krccDetails.attachments.vehicle}
          />
          
          <AttachmentSection 
            title="Insurance Attachments" 
            attachments={formData.krccDetails.attachments.insurance}
          />
          
          <AttachmentSection 
            title="Helmet Attachments" 
            attachments={formData.krccDetails.attachments.helmet}
          />
        </div>
      </div>
    </div>
  );
};