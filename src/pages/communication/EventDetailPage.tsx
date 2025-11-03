import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, MapPin, Calendar, Clock } from 'lucide-react';
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
  {
    id: '2',
    title: 'Gudi Padwa Celebration',
    status: 'Disable',
    createdBy: 'FM Helpdesk/FM - Office',
    createdOn: '18/03/2023',
    eventType: 'Personal',
    publishStatus: 'Published',
    location: 'Runwal Garden',
    dateRange: '18/03/2023 To 19/03/2023',
    time: '5:30 PM To 12:00 AM',
    likes: 5,
    description: `Join us for an evening celebration of Gudi Padwa!

Experience the vibrant culture and traditions of Maharashtra with:
- Traditional dance performances
- Authentic Maharashtrian cuisine
- Cultural activities for all ages
- Special entertainment programs

Venue: Runwal Garden Community Hall
Date: 18th March 2023
Time: 5:30 PM onwards

Please confirm your attendance by registering through the form provided.

Looking forward to celebrating with you!

Regards,
FM Team`,
    rsvp: 'Yes',
    files: [],
    sharedWithMembers: [
      'Asha Suresh Mishra / Tower 10 - T10-2003',
      'Pravin Prakash Birmole / Tower 10 - T10-1906',
      'Shirish Ramesh Shetty / Tower 10 - T10-1406',
      'Vilas Atmaram Murari / Tower 10 - T10-1706',
    ],
    sharedWithGroups: [],
    feedback: [],
  },
  {
    id: '3',
    title: 'Gudi Padwa Celebration',
    status: 'Disable',
    createdBy: 'FM Helpdesk/FM - Office',
    createdOn: '18/03/2023',
    eventType: 'Personal',
    publishStatus: 'Published',
    location: 'Runwal Garden',
    dateRange: '18/03/2023 To 19/03/2023',
    time: '5:15 PM To 12:00 AM',
    likes: 8,
    description: `Celebrate Gudi Padwa with us!

We invite all residents to join our grand Gudi Padwa celebration. This festival marks the beginning of the New Year according to the Hindu calendar.

Event Highlights:
- Traditional Gudi installation ceremony
- Cultural performances
- Delicious Maharashtrian snacks and refreshments
- Fun activities for children
- Music and entertainment

Date: March 18, 2023
Time: 5:15 PM to 12:00 AM
Venue: Runwal Garden Main Clubhouse

Don't miss this wonderful opportunity to celebrate our rich cultural heritage with your neighbors!

Regards,
FM Helpdesk`,
    rsvp: 'Yes',
    files: [],
    sharedWithMembers: [
      'Asha Suresh Mishra / Tower 10 - T10-2003',
      'Pravin Prakash Birmole / Tower 10 - T10-1906',
      'Shirish Ramesh Shetty / Tower 10 - T10-1406',
      'Vilas Atmaram Murari / Tower 10 - T10-1706',
      'Abhay R Samant / Tower 10 - T10-1001',
    ],
    sharedWithGroups: [],
    feedback: [],
  },
  {
    id: '4',
    title: 'Gudi Padwa Celebration',
    status: 'Disable',
    createdBy: 'FM Helpdesk/FM - Office',
    createdOn: '18/03/2023',
    eventType: 'Personal',
    publishStatus: 'Published',
    location: 'Runwal Garden',
    dateRange: '18/03/2023 To 19/03/2023',
    time: '3:15 PM To 12:00 AM',
    likes: 12,
    description: `Gudi Padwa Festival Celebration 2023

Dear Residents,

We are delighted to announce our annual Gudi Padwa celebration. This is a wonderful opportunity to come together as a community and celebrate this auspicious occasion.

Program Details:
3:15 PM - Registration and Welcome
4:00 PM - Traditional ceremonies
5:30 PM - Cultural program begins
7:00 PM - Dinner service
9:00 PM - Entertainment and games

Special attractions:
- Live music performances
- Traditional folk dances
- Special dinner arrangements
- Prizes and giveaways

Please join us for this memorable celebration!

Best regards,
FM Team
Runwal Gardens`,
    rsvp: 'Yes',
    files: [],
    sharedWithMembers: [
      'Asha Suresh Mishra / Tower 10 - T10-2003',
      'Pravin Prakash Birmole / Tower 10 - T10-1906',
      'Shirish Ramesh Shetty / Tower 10 - T10-1406',
    ],
    sharedWithGroups: [],
    feedback: [],
  },
  {
    id: '5',
    title: 'Possession',
    status: 'Disable',
    createdBy: 'RunwalGardens',
    createdOn: '28/12/2022',
    eventType: 'General',
    publishStatus: 'Published',
    location: 'Runwal Garden Sales Office',
    dateRange: '15/12/2022 To 15/12/2022',
    time: '11:00 AM To 6:00 PM',
    likes: 15,
    description: `FLAT POSSESSION DAY

Dear Valued Customers,

We are pleased to invite you for the possession of your new home at Runwal Gardens.

Date: December 15, 2022
Time: 11:00 AM to 6:00 PM
Venue: Runwal Garden Sales Office

Please bring the following documents:
1. Original Sale Agreement
2. Payment receipts
3. ID Proof (Aadhar/PAN Card)
4. Address Proof
5. Passport size photographs

Our team will be available to assist you with the possession formalities and handover process.

For any queries, please contact our customer care.

Welcome to your new home!

Regards,
Runwal Gardens Team`,
    rsvp: 'No',
    files: [],
    sharedWithMembers: [
      'All Tower Residents',
    ],
    sharedWithGroups: ['New Homeowners Group'],
    feedback: [],
  },
  {
    id: '6',
    title: 'Navratri Event',
    status: 'Disabled',
    createdBy: 'RunwalGardens',
    createdOn: '14/11/2022',
    eventType: 'General',
    publishStatus: 'Disabled',
    location: 'Runwal Garden Open Ground',
    dateRange: '30/09/2022 To 30/09/2022',
    time: '5:00 PM To 9:00 PM',
    likes: 25,
    description: `NAVRATRI CELEBRATION 2022

Dear Residents,

Join us for a vibrant Navratri celebration filled with music, dance, and festive spirit!

Event Details:
Date: September 30, 2022
Time: 5:00 PM to 9:00 PM
Venue: Runwal Garden Open Ground

Highlights:
- Live Garba and Dandiya music
- Professional dancers to teach traditional steps
- Traditional Navratri snacks and beverages
- Colorful decorations and ambiance
- Prizes for best dressed participants
- Fun activities for children

Dress Code: Traditional attire preferred
Entry: Free for all residents

Come dressed in your finest traditional outfits and celebrate the festival of nine nights with your community!

Note: Please carry your resident ID cards for entry.

Looking forward to celebrating with you all!

Warm regards,
Runwal Gardens Management`,
    rsvp: 'Yes',
    files: [],
    sharedWithMembers: [
      'All Residents - Tower 10, 11, 12, 13, 14',
      'Community Members',
    ],
    sharedWithGroups: ['All Residents Group', 'Festival Committee'],
    feedback: [
      {
        name: 'Priya Sharma',
        flat: 'Tower 12-T12-1505',
        date: '25/09/2022 - 6:30 PM',
        message: 'Excited for the event! Will there be parking arrangements?',
        tag: 'QUERY',
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading event details...</p>
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
          onClick={handleBack}
          className="text-[#1A1A1A] hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
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
        <div className="bg-[#C4B89D54] py-6 px-8 border-b border-gray-200">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">{event.title}</h1>
            <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 border border-red-200">
              {event.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Creator Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Created by <span className="font-semibold text-[#1A1A1A]">{event.createdBy}</span> on {event.createdOn}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200">
                {event.eventType}
              </span>
              <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-green-50 text-green-700 border border-green-200">
                {event.publishStatus}
              </span>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C72030] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-semibold text-[#1A1A1A]">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#C72030] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-semibold text-[#1A1A1A]">{event.dateRange}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#C72030] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-semibold text-[#1A1A1A]">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ThumbsUp className="w-5 h-5 text-[#C72030] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Likes</p>
                <p className="font-semibold text-[#1A1A1A]">{event.likes}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-4">
              Description
            </div>
            <div className="text-sm text-[#1A1A1A] whitespace-pre-line bg-gray-50 p-6 rounded border border-gray-200 leading-relaxed">
              {event.description}
            </div>
          </div>

          {/* RSVP Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-4">
              RSVP
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <span className="inline-flex px-3 py-1 text-sm font-medium rounded bg-green-50 text-green-700 border border-green-200">
                {event.rsvp}
              </span>
            </div>
          </div>

          {/* Files Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-4">
              Files
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              {event.files.length === 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1A1A1A]">Attachments</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#1A1A1A] text-xs font-semibold border border-gray-300">
                    0
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {event.files.map((file: string, index: number) => (
                    <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {file}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shared With Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-4">
              Shared With
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shared With (Member) */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Member</h3>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {event.sharedWithMembers.map((member: string, index: number) => (
                      <div key={index} className="text-sm text-[#1A1A1A] py-1 border-b border-gray-200 last:border-0">
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shared With (Group) */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Group</h3>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  {event.sharedWithGroups.length === 0 ? (
                    <p className="text-sm text-gray-500">No groups</p>
                  ) : (
                    <div className="space-y-2">
                      {event.sharedWithGroups.map((group: string, index: number) => (
                        <div key={index} className="text-sm text-[#1A1A1A] py-1 border-b border-gray-200 last:border-0">
                          {group}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-4">
              Feedback
            </div>
            <div className="space-y-4">
              {event.feedback.map((item: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#C4B89D54] flex items-center justify-center flex-shrink-0 border border-gray-300">
                      <span className="text-lg font-semibold text-[#1A1A1A]">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.flat}</p>
                        </div>
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-green-50 text-green-700 border border-green-200">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-sm text-[#1A1A1A] mb-2 leading-relaxed">{item.message}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
