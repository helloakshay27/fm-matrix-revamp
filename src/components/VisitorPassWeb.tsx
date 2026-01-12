import React from 'react';

interface VisitorPassProps {
  name?: string;
  role?: string;
  otp?: string;
  host?: string;
  passId?: string;
  visitDate?: string;
  timeSlot?: string;
  email?: string;
  purpose?: string;
  assets?: string;
  additionalVisitors?: number;
  location?: string;
  room?: string;
  status?: 'Approved' | 'Pending' | 'Rejected';
}

const VisitorPassWeb: React.FC<VisitorPassProps> = ({
  name = 'Rahul Jain',
  role = 'Visitor',
  otp = '58156',
  host = 'Rohit More',
  passId = '2456RA201',
  visitDate = '23 Dec 2025',
  timeSlot = '5:30 PM to 6:30 PM',
  email = 'rahuljain@gmail.com',
  purpose = 'Business Visit',
  assets = 'Laptop, Mobile phone',
  additionalVisitors = 2,
  location = 'UrbanWrk, Koncord Towers, Bund Garden, Pune',
  room = 'Sage',
  status = 'Approved',
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-4 sm:py-6 sm:px-6">
      <div className="w-full max-w-xs sm:max-w-sm">
        {/* Ticket header */}
        <div className="relative overflow-hidden rounded-t-md">
      <div className="bg-[#C72030] text-white px-5 py-4 rounded-t-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs opacity-90">OTP:</div>
                <div className="mt-1 text-2xl font-semibold tracking-wider">{otp.split('').join(' ')}</div>
                <div className="text-[11px] mt-2">Note : Show this QR code or OTP to the guard at the entrance.</div>
              </div>

              <div className="ml-3">
                <div className="w-24 h-24 bg-transparent rounded-sm flex items-center justify-center overflow-hidden">
                  {/* QR image (encodes passId and otp) - slightly larger */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${passId}|${otp}`)}&color=ffffff&bgcolor=C72030`}
                    alt="QR code"
                    className="w-20 h-20 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* perforation line with semicircles */}
          <div className="relative bg-white">
            <div className="h-3 bg-white -mt-0.5 flex items-center justify-between">
              <div className="w-6 h-6 bg-white rounded-full -ml-3 border-t border-b border-l border-white" />
              <div className="w-6 h-6 bg-white rounded-full -mr-3 border-t border-b border-r border-white" />
            </div>
            <div className="border-t border-dashed border-gray-200" />
          </div>
        </div>

        {/* Details card */}
        <div className="bg-[#F6F4EE] border border-gray-200 rounded-b-md p-3 -mt-1">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#f1f3f4] flex items-center justify-center p-1">
              <svg width="36" height="36" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="32" cy="20" r="12" fill="#d1d5db" />
                <path d="M12 54c0-11 10-18 20-18s20 7 20 18v2H12v-2z" fill="#e5e7eb" />
              </svg>
            </div>
              <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
          <div className="text-base font-semibold text-[#111827]">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
                </div>
        <div className={`text-sm font-semibold ${status === 'Approved' ? 'text-green-600' : status === 'Pending' ? 'text-yellow-600' : 'text-[#C72030]'}`}>
                  {status}
                </div>
              </div>
            </div>
          </div>

      <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Host Name :</div>
        <div className="font-medium text-[12px]">{host}</div>
        <div className="text-xs text-gray-500 mt-2">Visit Date :</div>
        <div className="font-medium text-[12px]">{visitDate}</div>

              <div className="text-xs text-gray-500 mt-2">Visitor Email ID :</div>
              <div className="font-medium text-[12px]">{email}</div>

              <div className="text-xs text-gray-500 mt-2">Assets carried :</div>
              <div className="font-medium text-[12px]">{assets}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-gray-500">Visitor Pass ID :</div>
              <div className="font-medium text-[12px]">{passId}</div>
              <div className="text-xs text-gray-500 mt-2">Time slot :</div>
              <div className="font-medium text-[12px]">{timeSlot}</div>

              <div className="text-xs text-gray-500 mt-2">Purpose :</div>
              <div className="font-medium text-[12px]">{purpose}</div>

              <div className="text-xs text-gray-500 mt-2">Additional Visitor :</div>
              <div className="font-medium text-[12px]">{additionalVisitors}</div>
            </div>
          </div>

          {/* Location & Room (full width) */}
          <div className="mt-3 text-[12px] text-gray-500">Location :</div>
          <div className="font-medium text-[12px]">{location}</div>
          <div className="text-[12px] text-gray-500 mt-2">Room: <span className="font-medium text-[11px]">{room}</span></div>

          <div className="mt-3 rounded text-[12px] text-[#C72030]">Important : Please present this pass along with a valid government ID at the security desk.</div>
        </div>

        {/* Consent box */}
        <div className="mt-2 border border-gray-200 bg-white  p-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[13px] font-semibold leading-tight">Consent - Visitor Agreement</div>
            <button className="text-[12px] text-[#C72030] bg-white border border-[#efe9e9] px-2 py-1 rounded">View more ▾</button>
          </div>
          <div className="text-[12px] text-gray-700">I am visiting Prime Focus Technologies Ltd on a business visit and will be providing my email...</div>
        </div>
      </div>
    </div>
  );
};

export default VisitorPassWeb;