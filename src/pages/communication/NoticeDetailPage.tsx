import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

// Sample notices data - in production, this would come from API/context
const sampleNotices = [
  {
    id: "1",
    title: "Water supply interupption T14 03 series",
    content: `Dear Residents
Greetings !
We would like to inform you about the plumbing line breakdown on the 3 series
this has causes temporary water supply interrupption of of common washroom of 03 series apartment
we are working to rectify the same on top priority thanks you for your cooperation and understanding
We will keep ypu updated on progress
Thanks
Regards
FM Helpdesk`,
    createdBy: "FM Helpdesk",
    status: "Published",
    shareWith: "Personal",
    createdOn: "03-10-2025",
    createdOnTime: "6: 46 PM",
    endDate: "04-10-2025",
    endTime: "10: 00 PM",
    important: "Yes",
    attachments: 0,
    flat: "FM-Office",
    type: "Personal",
  },
  {
    id: "2",
    title: "PRV Installation In 5 Series Flats, Tower 13 -- 04-10-2025",
    content: `Dear Residents,

We would like to inform you about the PRV installation work scheduled in 5 series flats.

The work will be carried out on 04-10-2025 from 10:00 AM to 5:00 PM.

Please cooperate with the maintenance team during this period.

Thank you for your understanding.

Regards,
FM Helpdesk`,
    createdBy: "FM Helpdesk",
    status: "Published",
    shareWith: "Personal",
    createdOn: "03-10-2025",
    createdOnTime: "3: 30 PM",
    endDate: "04-10-2025",
    endTime: "5: 00 PM",
    important: "Yes",
    attachments: 0,
    flat: "FM-Office",
    type: "Personal",
  },
];

const NoticeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [noticeDetails, setNoticeDetails] = useState<any>(null);

  useEffect(() => {
    // Find the notice by ID from sample data
    // In production, this would be an API call
    const notice = sampleNotices.find(n => n.id === id);
    if (notice) {
      setNoticeDetails(notice);
    } else {
      // If notice not found, use default data
      setNoticeDetails({
        id: id,
        title: "Notice Not Found",
        content: "The requested notice could not be found.",
        createdBy: "System",
        status: "Published",
        shareWith: "General",
        createdOn: new Date().toLocaleDateString('en-GB'),
        createdOnTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleDateString('en-GB'),
        endTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        important: "No",
        attachments: 0,
      });
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!noticeDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading notice details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/communication/notice')}
          className="text-[#1A1A1A] hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notices
        </Button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm max-w-6xl mx-auto border border-gray-200">
        {/* Print Button */}
        <div className="flex justify-end p-4 border-b border-gray-200">
          <Button 
            onClick={handlePrint}
            className="bg-[#C72030] hover:bg-[#A61B28] text-white px-6"
          >
            Print
          </Button>
        </div>

        {/* Title Section */}
        <div className="bg-[#C4B89D54] text-[#1A1A1A] py-6 px-8 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-center">{noticeDetails.title}</h1>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="mb-8 whitespace-pre-line text-[#1A1A1A] leading-relaxed">
            {noticeDetails.content}
          </div>

          <div className="mb-6 border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Created by</p>
            <p className="font-semibold text-[#1A1A1A]">{noticeDetails.createdBy}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-gray-200 pt-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase mb-2">STATUS TYPE</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                      noticeDetails.status === 'Published' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        noticeDetails.status === 'Published' 
                          ? 'bg-green-600' 
                          : 'bg-gray-600'
                      }`}></span>
                      {noticeDetails.status}
                    </span>
                    <span className="text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 uppercase mb-2">CREATED ON</p>
                  <p className="font-semibold text-[#1A1A1A]">{noticeDetails.createdOn}/</p>
                  <p className="text-sm text-gray-600">{noticeDetails.createdOnTime}</p>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase mb-2">SHARE WITH</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-[#C4B89D54] text-[#1A1A1A] border border-gray-200">
                    {noticeDetails.shareWith}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 uppercase mb-2">END DATE & TIME</p>
                <p className="font-semibold text-[#1A1A1A]">{noticeDetails.endDate}/</p>
                <p className="text-sm text-gray-600">{noticeDetails.endTime}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 uppercase mb-2">IMPORTANT</p>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                  {noticeDetails.important}
                </span>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1A1A1A]">Attachments</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C4B89D54] text-[#1A1A1A] text-xs font-semibold border border-gray-200">
                {noticeDetails.attachments}
              </span>
            </div>
          </div>

          {/* Shared Member List Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              className="bg-[#C72030] hover:bg-[#A61B28] text-white"
              onClick={() => {
                // Handle showing shared member list
                console.log('Show shared member list');
              }}
            >
              Shared Member List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
