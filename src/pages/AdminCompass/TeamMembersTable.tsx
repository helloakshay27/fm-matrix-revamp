import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const TeamMembersTable = () => {
  const members = [
    { score: 49, name: 'Adhip Shetty', email: 'adhip.shetty@lockated.com', department: 'Business Excellance', dailyReports: 40, dayRating: '9/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-orange-100' },
    { score: 0, name: 'Fatema Tashrifwala', email: 'fatema.t@gophygital.work', department: 'Human Resources', dailyReports: 0, dayRating: '0/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-red-100' },
    { score: 5, name: 'Jyoti', email: 'hr@lockated.com', department: 'HR', dailyReports: 0, dayRating: '0/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-red-100' },
    { score: 38, name: 'Sadanand Gupta', email: 'sadanand.gupta@lockated.com', department: 'QA', dailyReports: 38, dayRating: '5/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-red-100' },
    { score: 45, name: 'Akshay Shinde', email: 'akshay.shinde@lockated.com', department: 'Front End', dailyReports: 40, dayRating: '10/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-orange-100' },
    { score: 1, name: 'Akshit Baid', email: 'akshit.baid@lockated.com', department: 'Marketing', dailyReports: 0, dayRating: '0/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-red-100' },
    { score: 38, name: 'Arun Mohan', email: 'arunmohan@lockated.com', department: 'Client Servicing', dailyReports: 37, dayRating: '5/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-red-100' },
    { score: 45, name: 'Bilal Shaikh', email: 'bilal.shaikh@lockated.com', department: 'Engineering', dailyReports: 38, dayRating: '10/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-orange-100' },
    { score: 1, name: 'Chetan Bafna', email: 'chetan.bafna@lockated.com', department: 'Management', dailyReports: 0, dayRating: '0/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-red-100' },
    { score: 45, name: 'Kshitij Rasal', email: 'kshitij.rasal@lockated.com', department: 'Design', dailyReports: 43, dayRating: '10/10', weeklyReports: 0, weekRating: '0/10', dailyChecklist: 0, color: 'bg-orange-100' },
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="bg-white p-4 rounded-[10px] shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Team Members Overview</h2>
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500">
          <tr>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Score <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">User <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Department <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Daily Reports <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Day Rating <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Weekly Reports <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Week Rating <ArrowUpDown className="h-3 w-3" /></button></th>
            <th className="py-2 px-4"><button className="flex items-center gap-1">Daily Checklist <ArrowUpDown className="h-3 w-3" /></button></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className={`${member.color} border-b border-white`}>
              <td className="py-3 px-4">
                <div className="bg-red-500 text-white rounded-md h-8 w-8 flex items-center justify-center font-bold">{member.score}</div>
              </td>
              <td className="py-3 px-4 flex items-center gap-3">
                <div className="bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">{getInitials(member.name)}</div>
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-gray-500 text-xs">{member.email}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-md text-xs font-medium">{member.department}</span>
              </td>
              <td className="py-3 px-4">
                <div className="bg-blue-100 text-blue-600 rounded-md h-7 w-7 flex items-center justify-center font-bold">{member.dailyReports}</div>
              </td>
              <td className="py-3 px-4 font-semibold">{member.dayRating}</td>
              <td className="py-3 px-4">
                <div className="bg-blue-100 text-blue-600 rounded-md h-7 w-7 flex items-center justify-center font-bold">{member.weeklyReports}</div>
              </td>
              <td className="py-3 px-4 font-semibold">{member.weekRating}</td>
              <td className="py-3 px-4">
                <div className="bg-blue-100 text-blue-600 rounded-md h-7 w-7 flex items-center justify-center font-bold">{member.dailyChecklist}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersTable;
