import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';

// Sample event data - replace with actual API call
const sampleEventsData = [
  {
    id: '1',
    title: 'Gudi Padwa Celebration',
    status: 'Disable',
    createdBy: 'FM Helpdesk/FM - Office',
    createdOn: '18/03/2023',
    eventType: 'Personal',
    publishStatus: 'Published',
    location: 'Runwal Garden',
    dateRange: '18/03/2023 To 19/03/2023',
    time: '8:30 PM To 8:30 PM',
    likes: 3,
    description: `LET'S MARK THE BEGINNING OF A NEW YEAR*

We are excited to invite you to our first Gudi Padwa celebration. Join us for an unforgettable experience filled with traditional customs, cultural performances and mouth watering Maharashtrian delicacies.

March|22|2023
10:00 AM ONWARDS
VENUE : R U N W A L G A R D E N S

Request you to fill google form provided below to register yourself for the event

https://docs.google.com/forms/d/e/1FAlpQLSfn3tIkdsrmZgs9GDQPBkkgr36IOlCWilaN6aQVPpYGwz-jMuQ/viewform?vc=0&c=0&w=1&flr=0

Regards,
FM Team,
Runwal Gardens`,
    rsvp: 'Yes',
    files: [],
    sharedWithMembers: [
      'Asha Suresh Mishra / Tower 10 - T10-2003',
      'Pravin Prakash Birmole / Tower 10 - T10-1906',
      'Shirish Ramesh Shetty / Tower 10 - T10-1406',
      'Vilas Atmaram Murari / Tower 10 - T10-1706',
      'Abhay R Samant / Tower 10 - T10-1001',
      'Srikanth Venkittarama / Tower 10 - T10-1201',
      'Usha Rakesh Dubey / Tower 10 - T10-1704',
      'Bhavana R Thakkar / Tower 10 - T10-0606',
      'Shilpa Ranjit Kamat / Tower 10 - T10-2306',
      'Pragati Prashant Bhosale / Tower 10 - T10-1401',
      'Triloknath Laltaprasad / Tower 10 - T10-0306',
      'Amit A. Padave / Tower 10 - T10-1801',
      'Saksham Santosh Tiwari / Tower 10 - T10-0503',
      'Brijlal Shivshankar / Tower 10 - T10-1006',
      'Neha Ramniwas Sharma / Tower 10 - T10-1304',
      'Martin George Nadar / Tower 10 - T10-1905',
      'Reshma Vishal Nigade / Tower 10 - T10-1106',
      'Prathamesh Manohar Shigvan / Tower 10 - T10-1002',
      'Deepa Bhosale / Tower 10 - T10-0906',
      'Sudesh Gambhiria / Tower 10 - T10-0802',
      'Swasti Srivastava / Tower 10 - T10-1703',
      'Niket Kadam / Tower 10 - T10-1301',
      'ShaukalAli Shaikh / Tower 10 - T10-0403',
    ],
    sharedWithGroups: [],
    feedback: [
      {
        name: 'Girish Dinkar Kunir',
        flat: 'Tower Z-17-160518',
        date: '03/2023 - 9:52 PM',
        message: 'Not able to register for event',
        tag: 'IMPORTANT',
      },
      {
        name: 'Akshay Nalawade',
        flat: 'Tower 18-T18-190418',
        date: '03/2023 - 9:25 PM',
        message: 'Google Form is not accepting responses.',
        tag: 'SEND EMAIL',
      },
    ],
  },
];

const EventDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    // Replace with actual API call
    const foundEvent = sampleEventsData.find((e) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/communication/events');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!event) {
    return (
      <div className="flex-1 bg-white min-h-screen">
        <div className="p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1A1A1A] hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-[#1C3C6D] hover:bg-[#152d52] text-white px-4 py-2"
          >
            Print
          </Button>
        </div>

        {/* Event Title and Badges */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">{event.title}</h1>
            <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
              {event.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
            <span>
              Created by <span className="font-medium text-[#1A1A1A]">{event.createdBy}</span> on {event.createdOn}
            </span>
            <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
              {event.eventType}
            </span>
            <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
              {event.publishStatus}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#6B7280]">📍</span>
            <span className="text-[#1A1A1A]">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#6B7280]">📅</span>
            <span className="text-[#1A1A1A]">{event.dateRange}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#6B7280]">🕐</span>
            <span className="text-[#1A1A1A]">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp className="w-4 h-4 text-blue-500" />
            <span className="text-[#1A1A1A] font-medium">{event.likes}</span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 border-l-4 border-[#1C3C6D] pl-3">
            Description
          </h2>
          <div className="text-sm text-[#1A1A1A] whitespace-pre-line bg-gray-50 p-4 rounded">
            {event.description}
          </div>
        </div>

        {/* RSVP Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 border-l-4 border-[#1C3C6D] pl-3">
            RSVP
          </h2>
          <div className="text-sm text-[#1A1A1A]">{event.rsvp}</div>
        </div>

        {/* Files Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 border-l-4 border-[#1C3C6D] pl-3">
            Files
          </h2>
          {event.files.length === 0 ? (
            <p className="text-sm text-[#6B7280]">No files attached</p>
          ) : (
            <div className="space-y-2">
              {event.files.map((file: string, index: number) => (
                <div key={index} className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
                  {file}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared With Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Shared With (Member) */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 border-l-4 border-[#1C3C6D] pl-3">
              Shared With (Member)
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {event.sharedWithMembers.map((member: string, index: number) => (
                <div key={index} className="text-sm text-[#1A1A1A] py-1">
                  {member}
                </div>
              ))}
            </div>
          </div>

          {/* Shared With (Group) */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 border-l-4 border-[#1C3C6D] pl-3">
              Shared With (Group)
            </h2>
            {event.sharedWithGroups.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No groups</p>
            ) : (
              <div className="space-y-2">
                {event.sharedWithGroups.map((group: string, index: number) => (
                  <div key={index} className="text-sm text-[#1A1A1A] py-1">
                    {group}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 border-l-4 border-[#1C3C6D] pl-3">
            Feedback
          </h2>
          <div className="space-y-4">
            {event.feedback.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#1A1A1A]">{item.name}</span>
                    <span className="text-xs text-[#6B7280]">/ {item.flat}</span>
                  </div>
                  <p className="text-sm text-[#1A1A1A] mb-2">{item.message}</p>
                  <span className="text-xs text-[#6B7280]">{item.date}</span>
                </div>
                <div>
                  <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
