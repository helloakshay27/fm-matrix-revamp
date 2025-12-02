import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DailyReport: React.FC = () => {
    const location = useLocation();

    // Trigger print automatically when opened with ?auto=1
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const auto = params.get('auto') === '1';
        if (auto) {
            const t = setTimeout(() => {
                try { window.print(); } catch { /* noop */ }
            }, 400);
            return () => clearTimeout(t);
        }
    }, [location.search]);

    // Colors and borders
    const ACCENT = '#EBE6DD';
    const BORDER = 'black';

    const Card = ({ title, value }: { title: string; value: React.ReactNode }) => (
        <div
            className="rounded-sm text-center p-5 print:p-4"
            style={{ backgroundColor: ACCENT }}
        >
            <div className="text-lg sm:text-lg font-bold text-[#1a1a1a] mb-1 print:text-[12px]">{title}</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] print:text-3xl">{value}</div>
        </div>
    );

    const SectionTitle = ({ text }: { text: string }) => (
        <div
            className="w-full text-center font-bold tracking-wide text-[15px] py-2 print:text-[14px]"
            style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}`, borderBottom: 'none' }}
        >
            {text}
        </div>
    );

    const Table = ({
        headers,
        rows,
        insight,
    }: {
        headers: string[];
        rows: (React.ReactNode[])[];
        insight?: React.ReactNode;
    }) => (
        <table className="w-full table-fixed border-collapse" style={{ border: `1px solid ${BORDER}` }}>
            <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th
                            key={i}
                            className="text-left text-[13px] sm:text-sm font-extrabold uppercase tracking-wide text-[#1a1a1a] px-3 py-2 print:text-[11px]"
                            style={{ border: `1px solid ${BORDER}`, backgroundColor: ACCENT }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, idx) => (
                    <tr key={idx}>
                        {r.map((c, j) => (
                            <td key={j} className="align-top px-3 py-2 text-[13px] sm:text-sm text-[#1a1a1a] print:text-[11px]" style={{ border: `1px solid ${BORDER}` }}>
                                {c}
                            </td>
                        ))}
                    </tr>
                ))}
                {insight && (
                    <tr>
                        <td colSpan={headers.length} style={{ border: `1px solid ${BORDER}` }}>
                            <div className="px-4 py-3">
                                <div className="font-semibold text-[#1a1a1a] mb-2 print:text-[12px]">Insight:</div>
                                <div className="text-[13px] sm:text-sm text-[#1a1a1a] print:text-[11px]">{insight}</div>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div className="daily-report-zoom print:p-0">
            <style>{`
                @media print {
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    /* Reduce default browser print margins */
                    @page { size: A4; margin: 5mm; }
                    html, body { margin: 0 !important; padding: 0 !important; }
                }
                /* Screen-only scaling to approximate 125% browser zoom without causing horizontal scroll */
                @media screen {
                    .daily-report-zoom {
                        transform: scale(1.25);
                        transform-origin: top left;
                        width: calc(100% / 1.25);
                        max-width: 100vw;
                        overflow-x: hidden;
                    }
                }
            `}</style>

            {/* Top logo bar */}
            <div className="w-full" style={{ backgroundColor: ACCENT }}>
                <div className="w-full h-20 flex items-center pl-4 justify-start print:h-12 print:pl-4">
                    <svg
                        width="409"
                        height="74"
                        viewBox="0 0 409 74"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-auto print:h-7"
                        aria-label="goPhygital.work"
                    >
                        <path fillRule="evenodd" clipRule="evenodd" d="M100.026 4.38078H78.0938V33.9444H89.7578V25.1566H99.2102C107.399 25.1566 112.902 22.5072 112.902 14.5851C112.928 7.94836 108.847 4.38078 100.026 4.38078ZM97.5251 17.6281H89.7578V12.0406H97.5251C100.079 12.0406 101.29 12.8538 101.29 14.6901C101.29 16.7361 100.079 17.6281 97.5251 17.6281ZM133.491 10.8601C128.963 10.8601 126.593 12.7488 125.487 14.2441V4.40699H115.061V33.9706H125.487V22.1924C125.487 19.6479 126.172 17.8378 129.226 17.8378C132.333 17.8378 132.833 19.7004 132.833 22.1924V33.9706H143.26V20.0676C143.233 13.9031 139.968 10.8601 133.491 10.8601ZM163.876 11.4372L159.295 23.609L154.371 11.4372H143.655L154.477 33.7871L150.447 41.0009H161.059L174.618 11.4372H163.876ZM193.392 11.4372H203.817V32.2656C203.817 41.0009 196.103 41.8142 187.651 41.8142C177.725 41.8142 174.091 38.7187 173.907 34.1543H183.439C183.86 35.6233 185.993 35.807 187.625 35.807C190.074 35.807 193.339 35.8857 193.339 32.2656V30.3244C191.759 31.7671 189.468 32.5541 186.256 32.5541C179.252 32.5541 173.276 29.5636 173.276 21.9039C173.276 14.2703 178.462 10.8339 185.44 10.8339C188.968 10.8339 191.548 11.7258 193.339 13.4571V11.4372H193.392ZM188.731 26.3634C192.339 26.3634 194.207 24.8944 194.207 21.9301C194.207 18.9396 192.206 17.4444 188.731 17.4444C185.203 17.4444 183.439 19.1233 183.439 21.9301C183.439 24.7107 185.124 26.3634 188.731 26.3634ZM211.585 9.75839C214.719 9.75839 216.93 7.97458 216.93 4.90541C216.93 1.78378 214.719 0 211.585 0C208.451 0 206.24 1.78378 206.24 4.90541C206.24 7.97458 208.451 9.75839 211.585 9.75839ZM206.371 33.9706H216.798V11.4635H206.371V33.9706ZM239.731 17.0772V11.4635H233.122V5.63991H222.696V11.4635H218.51V17.0772H222.696V24.6058C222.696 32.6853 225.803 34.3642 235.045 34.3642C236.624 34.3642 238.363 34.2068 239.757 34.0231V27.2815C234.123 27.57 233.149 27.3601 233.149 24.5795V17.051H239.731V17.0772ZM255.845 10.8601C248.289 10.8601 243.469 12.8013 242.654 18.2838H251.975C252.264 16.8936 253.555 16.4213 255.845 16.4213C258.82 16.4213 259.531 17.4706 259.531 19.543V20.0938C244.602 19.3855 241.417 22.5072 241.417 27.7274C241.417 32.3706 244.839 34.5741 251.264 34.5741C255.345 34.5741 258.004 33.2099 259.531 31.6884V33.9182H269.957V19.5167C269.984 12.1192 263.322 10.8601 255.845 10.8601ZM259.557 27.8061C258.426 28.8553 256.635 29.6161 254.371 29.6161C253.001 29.6161 251.448 29.3276 251.448 27.5962C251.448 25.2615 254.345 25.1043 259.557 25.3665V27.8061ZM272.511 2.7806V33.9444H282.938V2.7806H272.511ZM288.836 28.8029C287.229 28.8029 285.914 30.0621 285.914 31.6623C285.914 33.2624 287.229 34.5479 288.836 34.5479C290.416 34.5479 291.733 33.2886 291.733 31.6623C291.733 30.0359 290.416 28.8029 288.836 28.8029ZM326.118 11.4372H331.622L322.723 33.9444H317.641L311.453 17.6281L305.318 33.9444H300.237L291.337 11.4372H296.841L302.896 27.9636L309.136 11.4372H313.85L320.089 27.9636L326.118 11.4372ZM345.418 10.8077C338.809 10.8077 332.49 14.4015 332.49 22.7171C332.49 31.0326 338.809 34.6002 345.418 34.6002C352.026 34.6002 358.398 31.0589 358.398 22.7171C358.372 14.4015 352.026 10.8077 345.418 10.8077ZM345.418 30.7442C339.362 30.7442 337.282 26.6518 337.282 22.7171C337.282 18.756 339.362 14.6375 345.418 14.6375C351.475 14.6375 353.554 18.7297 353.554 22.7171C353.554 26.6518 351.475 30.7442 345.418 30.7442ZM376.909 10.8077C372.038 10.8077 368.904 14.008 367.877 15.6607V11.4372H362.612V33.9444H367.877V22.5072C367.877 18.9921 370.037 15.713 375.776 15.713C377.224 15.713 378.357 15.8704 379.251 16.1328H379.41V10.9913C378.514 10.8601 377.935 10.8077 376.909 10.8077ZM401.474 33.9706H407.662L397.473 20.3562L407.109 11.4372H400.578L388.914 22.376V4.38078H383.649V33.9444H388.914V28.2783L393.786 23.7138L401.474 33.9706Z" fill="#141414"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M66.0867 38.4354H34.0473V6.14875C34.0473 3.80415 32.1474 1.91127 29.794 1.91127C28.0884 1.91127 26.6203 2.90074 25.951 4.34191C23.3387 2.72866 20.2945 1.80371 17.0128 1.80371C7.62124 1.80371 0 9.39678 0 18.7536C0 28.1106 7.62124 35.7036 17.0128 35.7036C20.1218 35.7036 23.0364 34.8647 25.5409 33.402C25.5409 35.1228 25.5409 36.8006 25.5409 38.4354H17.9413C17.6389 38.4138 17.3151 38.4138 17.0128 38.4138C7.62124 38.4138 0 46.0069 0 55.3638C0 64.7206 7.62124 72.3137 17.0128 72.3137C26.4045 72.3137 34.0257 64.7206 34.0257 55.3638C34.0257 54.9121 34.0041 54.4603 33.961 54.0301H34.069V46.9318H65.9356L66.0867 38.4354ZM16.9913 27.2286C12.3063 27.2286 8.48484 23.4214 8.48484 18.7536C8.48484 14.086 12.3063 10.2787 16.9913 10.2787C21.6763 10.2787 25.4978 14.086 25.4978 18.7536C25.4978 23.4428 21.6979 27.2286 16.9913 27.2286ZM25.5409 54.6324C25.5409 54.8905 25.5192 55.1271 25.4978 55.3638C25.4978 60.0314 21.6763 63.8387 16.9913 63.8387C12.3063 63.8387 8.48484 60.0314 8.48484 55.3638C8.48484 50.8467 12.0256 47.1685 16.4948 46.9104V46.9318H25.5409C25.5409 51.2338 25.5409 54.0301 25.5409 54.0301H25.5625C25.5192 54.2237 25.5409 54.4388 25.5409 54.6324ZM52.8737 10.2787C57.5588 10.2787 61.3802 14.086 61.3802 18.7536C61.3802 23.4214 57.5588 27.2286 52.8737 27.2286C48.1887 27.2286 44.3672 23.4214 44.3672 18.7536C44.3672 14.086 48.1671 10.2787 52.8737 10.2787ZM52.8737 1.80371C62.2654 1.80371 69.8866 9.39678 69.8866 18.7536C69.8866 28.1106 62.2654 35.7036 52.8737 35.7036C43.4821 35.7036 35.8609 28.1106 35.8609 18.7536C35.8609 9.39678 43.4821 1.80371 52.8737 1.80371Z" fill="#C72031"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M71.6946 41.7943C70.1185 40.6328 67.3549 38.611 65.5413 37.2772C65.1959 37.0407 64.7641 36.9977 64.3755 37.1912C64.0085 37.3848 63.771 37.7505 63.771 38.1807C63.771 38.2668 63.771 38.3528 63.771 38.4389H33.8906V46.9353H63.771C63.771 47.0213 63.771 47.1289 63.771 47.2149C63.771 47.6236 64.0085 48.0109 64.3755 48.2045C64.7426 48.398 65.1959 48.355 65.5413 48.0969C67.3549 46.7632 70.1185 44.7413 71.6946 43.5798C71.9751 43.3646 72.1479 43.042 72.1479 42.6978C72.1479 42.3537 71.9751 42.0095 71.6946 41.7943Z" fill="#C72031"/>
                    </svg>
                </div>
            </div>

            <div className="mx-auto px-6 py-6 print:px-0 print:py-4">
                {/* Header */}
                <header className="text-center mb-6 print:mb-4">
                    <h1 className="report-title text-2xl font-bold text-center">Daily Report</h1>
                    <div className="mt-1 text-black font-bold text-base print:text-sm">Site Name (12 May 2025)</div>
                </header>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print:mb-5">
                    <Card title="Open Ticket" value={<span>12</span>} />
                    <Card title="Overdue Ticket" value={<span>05</span>} />
                    <Card title="AMC Visit" value={<span>05</span>} />
                    <Card title="Present Emply" value={<span>50/60</span>} />
                </div>

                {/* AMC Section */}
                <div className="mb-6 print:mb-5">
                    <SectionTitle text="AMC" />
                    <Table
                        headers={["ID", "Contract Name", "Asset", "Schedule Time", "Contact Name", "Contact No."]}
                        rows={[[
                            <span>12345678</span>,
                            <span>Annual Maintenance Contract</span>,
                            <span>Air Conditioner</span>,
                            <span>01/10/2025</span>,
                            <span>Rajesh</span>,
                            <span>9879087666</span>,
                        ]]}
                        insight={(
                            <ul className="list-disc pl-5 space-y-1">
                                <li>AMC Due Today: 2</li>
                                <li>AMC Overdue Today: 5</li>
                            </ul>
                        )}
                    />
                </div>

                {/* Ticket Section */}
                <div className="mb-6 print:mb-5">
                    <SectionTitle text="Ticket" />
                    <Table
                        headers={["Ticket ID", "Title", "Issue Type", "Created Time", "Assign to", "Status"]}
                        rows={[
                            [<span>2616-9089</span>, <span>Need notepad in meeting room</span>, <span>Request</span>, <span>01/10/2025, 18:00</span>, <span>Rajesh</span>, <span>Open</span>],
                            [<span>2616-9089</span>, <span>AC not working</span>, <span>Complaint</span>, <span>01/10/2025, 18:00</span>, <span>Rajesh</span>, <span>Closed</span>],
                        ]}
                        insight={(
                            <ul className="list-disc pl-5 space-y-1">
                                <li>4 Ticket Open - will escalate in 30 mins</li>
                                <li>10 Complaint tickets resolved today</li>
                            </ul>
                        )}
                    />
                </div>

                {/* Activity/Task Section */}
                <div className="mb-6 print:mb-5">
                    <SectionTitle text="Activity/Task" />
                    <Table
                        headers={["Task ID", "Checklist", "Type", "Schedule", "Assign to", "Status"]}
                        rows={[
                            [<span>98698</span>, <span>Daily Maintenance</span>, <span>PPM</span>, <span>01/10/2025, 18:00</span>, <span>Rajesh</span>, <span>Open</span>],
                            [<span>98698</span>, <span>Common Area Cleaning</span>, <span>Routine</span>, <span>01/10/2025, 18:00</span>, <span>Rajesh</span>, <span>Closed</span>],
                        ]}
                        insight={(
                            <ul className="list-disc pl-5 space-y-1">
                                <li>1 activity pending (Daily Maintenance)</li>
                                <li>Completion rate today: 50%</li>
                            </ul>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default DailyReport;