
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const patrollingDetailsData = [
  {
    id: 1,
    patrollingDate: '15/04/2024',
    patrollingTime: '8:00 AM',
    graceTime: '2 Hours',
    approve: false,
    answer: '',
    comments: '',
    submittedBy: 'John Doe',
    attachments: ''
  },
  {
    id: 2,
    patrollingDate: '15/04/2024',
    patrollingTime: '11:00 AM',
    graceTime: '2 Hours',
    approve: true,
    answer: 'Completed',
    comments: 'All checks done',
    submittedBy: 'Jane Smith',
    attachments: 'report.pdf'
  }
];

export const PatrollingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>security</span>
          <span>&gt;</span>
          <span>Patrolling</span>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => navigate('/security/patrolling')}
            variant="ghost"
            className="p-0 h-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] uppercase">Patrolling List &gt; Patrolling Details</h1>
            <p className="text-sm text-gray-600 mt-1">
              Site - Lockated Site 1 / Building - HDFC Ergo Bhandup / Wing - Wing 1 / Floor - Floor 1 / Room - Room 1
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader className="bg-[#f6f4ee]">
              <TableRow>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">ID</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Patrolling Date</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Patrolling Time</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Grace Time(Hours)</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Approve</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Answer</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Comments</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Submitted By</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Attachments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patrollingDetailsData.map((detail) => (
                <TableRow key={detail.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-gray-900">{detail.id}</TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.patrollingDate}</TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.patrollingTime}</TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.graceTime}</TableCell>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={detail.approve}
                      className="text-blue-600"
                      readOnly
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.answer}</TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.comments}</TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.submittedBy}</TableCell>
                  <TableCell className="text-sm text-gray-900">{detail.attachments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
