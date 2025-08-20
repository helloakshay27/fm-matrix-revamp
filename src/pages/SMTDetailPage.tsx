import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Users, FileText, Building2, CalendarCheck2, MessageCircle, ClipboardList, Paperclip, Eye } from 'lucide-react';

const fallback = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  unique_id: 'SMT123',
  function: 'Operations',
  circle: 'Circle A',
  zone: 'Zone 1',
  work_location: 'Warehouse',
  type_of_facility: 'Storage',
  area_of_visit: 'Warehouse',
  smt_done_date: '2025-08-01',
  people_interacted: ['Person 1', 'Person 2', 'Person 3', 'Person 4'],
  topics_discussed: {
    road_safety: true,
    electrical_safety: false,
    work_height_safety: true,
    ofc: false,
    health_wellbeing: true,
    tool_box_talk: true,
    thank_you_card: false,
  },
  attachments: {
    thank_you_card: '',
    other_images: [],
  },
  key_observations: '',
  person_responsible: '',
};

const SMTDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.row || {};
  const user = { ...fallback, ...data };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* SMT Details - Done By */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">SMT DETAILS</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Name</span>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Email Id</span>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Unique Id</span>
              <p className="text-gray-900 font-medium">{user.unique_id}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Function</span>
              <p className="text-gray-900 font-medium">{user.function}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Circle</span>
              <p className="text-gray-900 font-medium">{user.circle}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Zone/Work Location</span>
              <p className="text-gray-900 font-medium">{user.zone || user.work_location}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Type of Facility & Area of Visit */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Type of Facility & Area of Visit</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="text-gray-500 text-sm">Type of Facility</span>
            <p className="text-gray-900 font-medium">{user.type_of_facility}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Area of Visit</span>
            <p className="text-gray-900 font-medium">{user.area_of_visit}</p>
          </div>
        </div>
      </div>


      {/* SMT Date */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">SMT Date</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900 font-medium">{user.smt_done_date ? new Date(user.smt_done_date).toLocaleDateString() : ''}</p>
        </div>
      </div>


      {/* People Interacted With */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">People Interacted With</h2>
        </div>
        <div className="p-6">
          <ul className="list-decimal ml-6 mt-2 text-gray-900">
            {(user.people_interacted || []).map((person, idx) => (
              <li key={idx}>{person}</li>
            ))}
          </ul>
        </div>
      </div>


      {/* Topics Discussed */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Topics Discussed</h2>
        </div>
        <div className="p-6">
          <ul className="mt-2 text-gray-900">
            <li>Road Safety: {user.topics_discussed?.road_safety ? 'Yes' : 'No'}</li>
            <li>Electrical Safety: {user.topics_discussed?.electrical_safety ? 'Yes' : 'No'}</li>
            <li>Work/Height Safety: {user.topics_discussed?.work_height_safety ? 'Yes' : 'No'}</li>
            <li>OFC: {user.topics_discussed?.ofc ? 'Yes' : 'No'}</li>
            <li>Health and wellbeing initiatives by in: {user.topics_discussed?.health_wellbeing ? 'Yes' : 'No'}</li>
            <li>Tool Box Talk: {user.topics_discussed?.tool_box_talk ? 'Yes' : 'No'}</li>
            <li>Thank you card given: {user.topics_discussed?.thank_you_card ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>


      {/* Attachments */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Paperclip className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Attachments</h2>
        </div>
        <div className="p-6">
          <div className="mt-2">
            <div>Thank you Card: {user.attachments?.thank_you_card ? (
              <a href={user.attachments.thank_you_card} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline"><FileText className="w-4 h-4" />View</a>
            ) : <span className="text-gray-400">No file</span>}</div>
            <div className="mt-2">Other Images:
              {user.attachments?.other_images && user.attachments.other_images.length > 0 ? (
                <ul className="list-disc ml-6">
                  {user.attachments.other_images.map((img, idx) => (
                    <li key={idx}><a href={img} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Image {idx + 1}</a></li>
                  ))}
                </ul>
              ) : <span className="text-gray-400 ml-2">No images</span>}
            </div>
          </div>
        </div>
      </div>


      {/* Key Observations */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Key Observations/Experience with talking to people</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900 mt-2">{user.key_observations || <span className="text-gray-400">N/A</span>}</p>
        </div>
      </div>


      {/* Person Responsible for Location */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Person Responsible for Location</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900 mt-2">{user.person_responsible || <span className="text-gray-400">N/A</span>}</p>
        </div>
      </div>
    </div>
  );
};

export default SMTDetailPage;
