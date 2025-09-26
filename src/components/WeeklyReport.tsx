import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Clean final version
type StatCardProps = { value: number | string; label: string; percent?: string; subLabel?: string };
const StatCard: React.FC<StatCardProps> = ({ value, label, percent, subLabel }) => {
    const formatted = typeof value === 'number' ? value.toLocaleString() : value;
    return (
        <div className="bg-[#F6F4EE] rounded-sm p-8 sm:p-10 text-center print:p-6">
            <div className="text-[#C72030] font-extrabold leading-none text-4xl sm:text-5xl print:text-3xl">{formatted}</div>
            {percent && <div className="mt-2 text-black font-semibold text-base sm:text-lg print:text-sm">{percent}</div>}
            <div className="mt-2 text-black font-semibold text-base sm:text-lg print:text-sm">{label}</div>
            {subLabel && <div className="mt-1 text-black font-medium text-sm sm:text-base print:text-xs">{subLabel}</div>}
        </div>
    );
};

type TATPieCardProps = { title: string; achieved: number; breached: number };
const TATPieCard: React.FC<TATPieCardProps> = ({ title, achieved, breached }) => {
    const total = achieved + breached;
    const achPct = total ? Math.round((achieved / total) * 100) : 0;
    const brcPct = total ? Math.round((breached / total) * 100) : 0;
    const data = [
        { name: 'Achieved', value: achieved, color: '#D9D3C4' },
        { name: 'Breached', value: breached, color: '#C4B89D' }
    ];
    return (
        <div className="w-full">
            <h3 className="text-black font-semibold text-base sm:text-lg mb-2">{title}</h3>
            <div className="bg-[#F6F4EE] rounded-sm px-6 sm:px-8 py-5 sm:py-6">
                <div className="w-full h-[300px] sm:h-[360px] print:h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 8, right: 40, bottom: 8, left: 40 }}>
                            <Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={110} stroke="#FFFFFF" paddingAngle={0}>
                                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-base">
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#D9D3C4' }} /> <span className="text-black font-medium">Achieved:</span> <span className="text-black/80">{achieved.toLocaleString()} ({achPct}%)</span></div>
                    <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: '#C4B89D' }} /> <span className="text-black font-medium">Breached:</span> <span className="text-black/80">{breached.toLocaleString()} ({brcPct}%)</span></div>
                </div>
            </div>
        </div>
    );
};

type WeeklyReportProps = { title?: string };
const WeeklyReport: React.FC<WeeklyReportProps> = ({ title = 'Weekly Report' }) => {
    const sectionBox = 'bg-white border border-gray-300 w-[95%] mx-auto p-5 mb-10 print:w-[95%] print:mx-auto print:p-2 print:mb-4 no-break';
    return (
        <div className="w-full print-exact">
            <style>{`@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .no-break { break-inside: avoid !important; page-break-inside: avoid !important; } }`}</style>
            <header className="w-full bg-[#F6F4EE] py-6 sm:py-8 mb-6 print:py-4 print:mb-4">
                <h1 className="text-center text-black font-extrabold text-3xl sm:text-4xl print:text-2xl">{title}</h1>
            </header>

            {/* 1. Help Desk Management */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">1. Help Desk Management</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard value={100} percent="(100%)" label="Total Tickets" />
                        <StatCard value={20} percent="20%" label="Open Tickets" />
                        <StatCard value={80} percent="80%" label="Closed Tickets" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <StatCard value={90} label="Reactive Tickets" subLabel="(User Generated)" />
                        <StatCard value={10} label="Preventive Tickets" subLabel="(Team Generated)" />
                    </div>
                </div>
            </section>

            {/* 2. Priority Wise Tickets */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">2. Priority Wise Tickets</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/2">Priority</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-1/2">Open Tickets</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200"><td className="p-4 print:p-2 text-black">High (P1)</td><td className="p-4 print:p-2 text-center text-black">0</td></tr>
                                <tr className="border-b border-gray-200"><td className="p-4 print:p-2 text-black">Medium (P2, P3)</td><td className="p-4 print:p-2 text-center text-black">0</td></tr>
                                <tr><td className="p-4 print:p-2 text-black">Low (P4, P5)</td><td className="p-4 print:p-2 text-center text-black">0</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 3. Category Wise Ticket (Top-5) */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">3. Category Wise Ticket (Top-5)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left">Category</th>
                                    <th colSpan={3} className="bg-[#ECE6DE] w-3/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total (Category Wise)</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Count</th>
                                    <th className="bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">% out of total</th>
                                    <th className="bg-[#ECE6DE] w-1/4 text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">% inc./dec. from last week</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['Air Conditioning', 'House Keeping', 'Cleaning', 'Technical', 'IT'].map((c, i) => (
                                    <tr key={c} className={i !== 4 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-4 print:p-2 text-black border-r border-gray-300 break-words whitespace-normal">{c}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">05</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">12%</td>
                                        <td className="p-4 print:p-2 text-center text-black break-words whitespace-normal"><span>12%</span> <span className={`ml-2 ${c === 'Technical' || c === 'IT' ? 'text-[#C72030]' : 'text-green-600'}`}>{c === 'Technical' || c === 'IT' ? '▼' : '▲'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Tickets Ageing Matrix */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Tickets Ageing Matrix</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/6">Priority</th>
                                    <th colSpan={5} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">No. of Days</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">0-10</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">11-20</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">21-30</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">31-40</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">40 +</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { p: 'P1', d: [12, 7, 22, 9, 30] },
                                    { p: 'P2', d: [22, 6, 4, 3, 2] },
                                    { p: 'P3', d: [2, 1, 12, 0, 4] },
                                    { p: 'P4', d: [2, 1, 0, 0, 0] },
                                    { p: 'P5', d: [3, 17, 0, 0, 0] }
                                ].map((row, i) => (
                                    <tr key={row.p} className={i !== 4 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-4 print:p-2 text-black border-r border-gray-300 w-1/6">{row.p}</td>
                                        {row.d.map((v, j) => (<td key={j} className={`p-4 print:p-2 text-center text-black ${j < row.d.length - 1 ? 'border-r border-gray-300' : ''}`}>{v}</td>))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* TAT Achievement (Response & Resolution) */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">TAT Achievement (Response & Resolution)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="mb-6 print:mb-3">
                        <StatCard value="3.71 Days" label="Average Time Taken To Resolve A Ticket" />
                    </div>
                    <TATPieCard title="Response TAT Overall" achieved={51953} breached={93041} />
                    <div className="border-t border-gray-200 my-5 print:my-4" />
                    <TATPieCard title="Resolution TAT Overall" achieved={110043} breached={34951} />
                </div>
            </section>

            {/* TAT Achievement Category-Wise */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">TAT Achievement Category-Wise (Top 5 Categories)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-[28%]">Category</th>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[10%]">Total</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center w-[24%]">Resolution TAT</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center w-[24%]">Resolution TAT %</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Achieved</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Breached</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Achieved %</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Breached %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { c: 'Air conditioning', t: 1702, a: 1275, b: 427, ap: '74.91%', bp: '25.09%' },
                                    { c: 'Asset Repair & Maintenance (Complaints received from Finops)', t: 1607, a: 1352, b: 255, ap: '84.13%', bp: '15.87%' },
                                    { c: 'Cafeteria/Pantry', t: 15141, a: 12020, b: 3121, ap: '79.39%', bp: '20.61%' },
                                    { c: 'HOUSEKEEPING', t: 119493, a: 89881, b: 29612, ap: '75.22%', bp: '24.78%' },
                                    { c: 'Preparedness', t: 1590, a: 1590, b: 0, ap: '100.0%', bp: '0.0%' }
                                ].map((row, i) => (
                                    <tr key={row.c} className={i !== 4 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-4 print:p-2 text-black border-r border-gray-300 align-top">{row.c}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.t.toLocaleString()}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.a.toLocaleString()}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.b.toLocaleString()}</td>
                                        <td className="p-4 print:p-2 text-center text-black border-r border-gray-300">{row.ap}</td>
                                        <td className="p-4 print:p-2 text-center text-black">{row.bp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Customer Experience Feedback */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Customer Experience Feedback</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="border border-gray-300 rounded-sm overflow-hidden">
                        <div className="grid grid-cols-5">
                            {['Excellent', 'Good', 'Average', 'Bad', 'Poor'].map(h => <div key={h} className="p-3 sm:p-4 print:p-2 text-center font-semibold text-black border-b border-gray-300">{h}</div>)}
                        </div>
                        <div className="grid grid-cols-5">
                            <div className="bg-[#EDE7DB] p-6 sm:p-8 print:p-4 text-center"><div className="text-3xl sm:text-4xl font-extrabold text-black">56</div><div className="mt-2 text-sm sm:text-base text-black/80">8.52%</div></div>
                            <div className="bg-[#D9D3C4] p-6 sm:p-8 print:p-4 text-center border-l-2 border-white"><div className="text-3xl sm:text-4xl font-extrabold text-black">19</div><div className="mt-2 text-sm sm:text-base text-black/80">2.89%</div></div>
                            <div className="bg-[#C4B89D] p-6 sm:p-8 print:p-4 text-center border-l-2 border-white"><div className="text-3xl sm:text-4xl font-extrabold text-black">14</div><div className="mt-2 text-sm sm:text-base text-black/80">2.13%</div></div>
                            <div className="bg-[#C1A593] p-6 sm:p-8 print:p-4 text-center border-l-2 border-white"><div className="text-3xl sm:text-4xl font-extrabold text-black">8</div><div className="mt-2 text-sm sm:text-base text-black/80">1.22%</div></div>
                            <div className="bg-[#D5DBDB] p-6 sm:p-8 print:p-4 text-center border-l-2 border-white"><div className="text-3xl sm:text-4xl font-extrabold text-black">3</div><div className="mt-2 text-sm sm:text-base text-black/80">0.36%</div></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Feedback */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Customer Feedback</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    {(() => {
                        // Weekly stacked distribution of feedback sentiment (placeholder demo data)
                        const weeklyTrendData = [
                            { day: 'Mon', Excellent: 12, Good: 4, Average: 3, Bad: 2, Poor: 1 },
                            { day: 'Tue', Excellent: 10, Good: 6, Average: 2, Bad: 1, Poor: 1 },
                            { day: 'Wed', Excellent: 9, Good: 5, Average: 3, Bad: 2, Poor: 1 },
                            { day: 'Thu', Excellent: 13, Good: 4, Average: 2, Bad: 1, Poor: 0 },
                            { day: 'Fri', Excellent: 12, Good: 6, Average: 4, Bad: 2, Poor: 1 }
                        ];
                        const palette: Record<string, string> = {
                            Excellent: '#EDE7DB',
                            Good: '#D9D3C4',
                            Average: '#C4B89D',
                            Bad: '#C1A593',
                            Poor: '#D5DBDB'
                        };
                        const categories = Object.keys(palette);
                        return (
                            <div className="bg-[#F6F4EE] rounded-sm p-6 sm:p-8">
                                <h3 className="text-black font-semibold text-base sm:text-lg mb-4">Weekly Trend</h3>
                                <div className="w-full h-72 sm:h-80 print:h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyTrendData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                                            <CartesianGrid stroke="#DDD" strokeDasharray="3 3" />
                                            <XAxis dataKey="day" stroke="#000" fontSize={12} />
                                            <YAxis stroke="#000" fontSize={12} />
                                            <Tooltip cursor={{ fill: '#00000008' }} wrapperStyle={{ fontSize: '12px' }} />
                                            {categories.map(cat => (
                                                <Bar key={cat} dataKey={cat} stackId="fb" fill={palette[cat]} radius={[4,4,0,0]} />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm print:text-[10px]">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex items-center gap-2">
                                            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: palette[cat] }} />
                                            <span className="text-black font-medium">{cat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* 4. Asset Management */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">4. Asset Management</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/5">Count</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Critical</th>
                                    <th colSpan={2} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Non-Critical</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">In Use</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Breakdown</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">In Use</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Breakdown</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200"><td className="p-4 print:p-2 text-black">Total No.</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td></tr>
                                <tr><td className="p-4 print:p-2 text-black">%</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td><td className="p-4 print:p-2 text-center text-black">&nbsp;</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 5. Task Status */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">5. Task Status</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="align-middle bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-left w-1/3">Task Status</th>
                                    <th colSpan={3} className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total (Category Wise)</th>
                                </tr>
                                <tr>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Technical</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 border-r text-center">Non-Technical</th>
                                    <th className="bg-[#ECE6DE] text-black font-semibold p-3 sm:p-4 print:p-2 border-b border-gray-300 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['Open', 'Work in Progress', 'Partially Closed', 'Closed', 'Overdue', 'Total Checklist'].map((s, i) => (
                                    <tr key={s} className={i !== 5 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-4 print:p-2 text-black">{s}</td>
                                        <td className="p-4 print:p-2 text-center text-black">34% <span className="text-green-600">▲</span></td>
                                        <td className="p-4 print:p-2 text-center text-black">12% <span className="text-[#C72030]">▲</span></td>
                                        <td className="p-4 print:p-2 text-center text-black">12% <span className={s === 'Closed' || s === 'Overdue' || s === 'Total Checklist' ? 'text-[#C72030]' : 'text-green-600'}>▲</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Category-Wise Overdue Status (Top 5) */}
            <section className={sectionBox}>
                <div className="px-1 sm:px-2">
                    <h2 className="text-black font-extrabold text-xl sm:text-2xl print:text-lg">Category-Wise Overdue Status (Top 5)</h2>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm sm:text-base print:text-sm border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="bg-[#ECE6DE] font-semibold p-4 sm:p-5 print:p-2 border-b border-gray-300 text-left w-3/4">Category Of Checklist (PPM)</th>
                                    <th className="bg-[#ECE6DE] font-semibold p-4 sm:p-5 print:p-2 border-b border-gray-300 text-center w-1/4">Overdue Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { c: 'Daily Kiosk Meter Reading', o: 72 },
                                    { c: 'Maintenance for Fire Fighting Panel', o: 60 },
                                    { c: 'Maintenance for Kitchen Exhaust', o: 90 },
                                    { c: 'PPM for Sump pump Panel', o: 72 },
                                    { c: 'Hourly Gents Washroom Checklist (new)', o: 72 }
                                ].map((row, i) => (
                                    <tr key={row.c} className={i !== 4 ? 'border-b border-gray-200' : ''}>
                                        <td className="p-5 sm:p-6 print:p-3 text-black align-top">{row.c}</td>
                                        <td className="p-5 sm:p-6 print:p-3 text-center text-black font-medium">{row.o}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WeeklyReport;