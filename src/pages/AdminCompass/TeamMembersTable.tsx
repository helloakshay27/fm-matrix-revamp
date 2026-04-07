import { ArrowUpDown } from 'lucide-react';

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getScoreStyles = (score: number) => {
    if (score >= 40) return 'bg-emerald-100 text-emerald-700';
    if (score >= 20) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Team Members Overview</h2>
          <p className="mt-1 text-xs text-neutral-600">Daily and weekly performance snapshot by team member</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
          {members.length} Members
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm text-left">
          <thead>
            <tr className="border-b border-[#DA7756]/20 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Score <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">User <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Department <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Daily Reports <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Day Rating <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Weekly Reports <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Week Rating <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
              <th className="px-3 py-3 font-semibold"><button className="flex items-center gap-1.5">Daily Checklist <ArrowUpDown className="h-3.5 w-3.5" /></button></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DA7756]/15">
            {members.map((member, index) => (
              <tr key={index} className="bg-[#fef6f4]/90 transition-colors hover:bg-[#fef6f4]">
                <td className="px-3 py-3">
                  <div className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-bold tabular-nums ${getScoreStyles(member.score)}`}>
                    {member.score}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DA7756] text-xs font-bold text-white">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{member.name}</p>
                      <p className="text-xs text-neutral-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                    {member.department}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-sky-100 px-2 text-xs font-bold text-sky-700 tabular-nums">
                    {member.dailyReports}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                    {member.dayRating}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-sky-100 px-2 text-xs font-bold text-sky-700 tabular-nums">
                    {member.weeklyReports}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-700 border border-[#DA7756]/20">
                    {member.weekRating}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-violet-100 px-2 text-xs font-bold text-violet-700 tabular-nums">
                    {member.dailyChecklist}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersTable;
