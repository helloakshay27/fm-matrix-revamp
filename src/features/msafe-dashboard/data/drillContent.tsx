import type { ReactNode } from 'react';

export type DrillAction = {
  label: string;
  variant?: 'primary' | 'sec' | 'err';
};

export type DrillDef = {
  crumb: string;
  title: string;
  body: ReactNode;
  actions?: DrillAction[];
};

function Stats({
  items,
  two,
}: {
  items: { v: string; l: string; tone?: 'ok' | 'warn' | 'err' }[];
  two?: boolean;
}) {
  return (
    <div className={`dr-stats${two ? ' two' : ''}`}>
      {items.map((s) => (
        <div key={s.l} className={`dr-stat${s.tone ? ` ${s.tone}` : ''}`}>
          <div className="v">{s.v}</div>
          <div className="l">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <div className="dr-note">{children}</div>;
}

/** Drill panel bodies matching vi_msafe_v6.html DRILL_CONTENT */
export const DRILL_CONTENT: Record<string, DrillDef> = {
  'circle-underperform': {
    crumb: 'Circles › Growth Focus',
    title: 'Circles That Need Growth in Performance',
    body: (
      <>
        <h4>Weighted Compliance Scores</h4>
        <table className="dr-tbl">
          <thead>
            <tr>
              <th>Circle</th>
              <th>KRCC</th>
              <th>LMC</th>
              <th>Training</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strong">Bihar</td>
              <td className="num">74%</td>
              <td className="num">68%</td>
              <td className="num">87%</td>
              <td className="num" style={{ color: 'var(--vi-red)' }}>
                71.8
              </td>
            </tr>
            <tr>
              <td className="strong">Assam</td>
              <td className="num">76%</td>
              <td className="num">71%</td>
              <td className="num">89%</td>
              <td className="num" style={{ color: 'var(--vi-red)' }}>
                73.1
              </td>
            </tr>
            <tr>
              <td className="strong">NESA</td>
              <td className="num">79%</td>
              <td className="num">75%</td>
              <td className="num">86%</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                75.6
              </td>
            </tr>
            <tr>
              <td className="strong">Kolkata</td>
              <td className="num">78%</td>
              <td className="num">74%</td>
              <td className="num">85%</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                76.2
              </td>
            </tr>
            <tr>
              <td className="strong">MP & CG</td>
              <td className="num">81%</td>
              <td className="num">78%</td>
              <td className="num">88%</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                81.4
              </td>
            </tr>
          </tbody>
        </table>
        <Note>Weights: KRCC 30% · LMC 25% · Training 20% · SMT 15% · External 10%</Note>
      </>
    ),
    actions: [{ label: 'Schedule SPOC Review' }],
  },

  'smt-gap-circles': {
    crumb: 'Alerts › SMT',
    title: '5 Circles Building SMT Visit Coverage',
    body: (
      <>
        <table className="dr-tbl">
          <thead>
            <tr>
              <th>Circle</th>
              <th>Visits</th>
              <th>Target</th>
              <th>Gap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strong">Bihar</td>
              <td className="num">12</td>
              <td className="num">20</td>
              <td className="num" style={{ color: 'var(--vi-red)' }}>
                -8
              </td>
            </tr>
            <tr>
              <td className="strong">NESA</td>
              <td className="num">14</td>
              <td className="num">20</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                -6
              </td>
            </tr>
            <tr>
              <td className="strong">Odisha</td>
              <td className="num">15</td>
              <td className="num">20</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                -5
              </td>
            </tr>
            <tr>
              <td className="strong">MP & Chhattisgarh</td>
              <td className="num">17</td>
              <td className="num">20</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                -3
              </td>
            </tr>
            <tr>
              <td className="strong">Assam</td>
              <td className="num">18</td>
              <td className="num">20</td>
              <td className="num" style={{ color: '#8A5A00' }}>
                -2
              </td>
            </tr>
          </tbody>
        </table>
        <Note>Total shortfall: 24 visits. Recommended: reassign SMT members from over-target circles.</Note>
      </>
    ),
    actions: [{ label: 'Assign Additional Visits' }],
  },

  'krcc-stale': {
    crumb: 'Alerts › KRCC',
    title: '213 KRCC Checks Pending > 7 Days',
    body: (
      <>
        <Stats
          items={[
            { v: '148', l: '8–14 Days', tone: 'warn' },
            { v: '65', l: '15+ Days', tone: 'err' },
            { v: '213', l: 'Total > 7d' },
          ]}
        />
        <h4>Concentration by Circle</h4>
        <table className="dr-tbl">
          <thead>
            <tr>
              <th>Circle</th>
              <th>Pending &gt; 7d</th>
              <th>Circle SPOC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strong">Bihar</td>
              <td className="num">44</td>
              <td>Rupesh Kumar</td>
            </tr>
            <tr>
              <td className="strong">Assam</td>
              <td className="num">32</td>
              <td>Agnijeeta Banik</td>
            </tr>
            <tr>
              <td className="strong">Kolkata</td>
              <td className="num">28</td>
              <td>Anup Basak</td>
            </tr>
            <tr>
              <td className="strong">NESA</td>
              <td className="num">22</td>
              <td>Hirok Paul</td>
            </tr>
            <tr>
              <td className="strong">MP & Chhattisgarh</td>
              <td className="num">18</td>
              <td>Rakesh M</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
    actions: [
      { label: 'Auto-Escalate to L2', variant: 'err' },
      { label: 'Notify Circle SPOCs', variant: 'sec' },
    ],
  },

  'ext-approval-pending': {
    crumb: 'Alerts › External',
    title: '86 External Approvals Awaiting',
    body: (
      <>
        <h4>Where They&apos;re Stuck</h4>
        <table className="dr-tbl">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Count</th>
              <th>Avg Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strong">L2 SPOC Review</td>
              <td className="num">62</td>
              <td className="num">5.4 days</td>
            </tr>
            <tr>
              <td className="strong">Document Verification</td>
              <td className="num">18</td>
              <td className="num">3.2 days</td>
            </tr>
            <tr>
              <td className="strong">Final Approval</td>
              <td className="num">6</td>
              <td className="num">1.8 days</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
    actions: [{ label: 'Bulk Escalate' }],
  },

  'train-fail': {
    crumb: 'Alerts › Training',
    title: '34 Training Re-attempts Due',
    body: (
      <>
        <Stats
          items={[
            { v: '34', l: 'Failed 7d', tone: 'err' },
            { v: '12', l: 'Re-attempt Unbooked', tone: 'warn' },
            { v: '22', l: 'Re-attempt Booked' },
          ]}
        />
        <h4>Failures by Programme</h4>
        <table className="dr-tbl">
          <thead>
            <tr>
              <th>Training</th>
              <th>Failed</th>
              <th>Avg Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="strong">First Aid Training</td>
              <td className="num">14</td>
              <td className="num">41/100</td>
            </tr>
            <tr>
              <td className="strong">Electrical Safety</td>
              <td className="num">9</td>
              <td className="num">44/100</td>
            </tr>
            <tr>
              <td className="strong">Fire Handling</td>
              <td className="num">7</td>
              <td className="num">42/100</td>
            </tr>
            <tr>
              <td className="strong">Working at Heights</td>
              <td className="num">4</td>
              <td className="num">39/100</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
    actions: [
      { label: 'Auto-schedule Re-attempts' },
      { label: 'Notify Learners', variant: 'sec' },
    ],
  },

  'smt-below': {
    crumb: 'SMT › Progress',
    title: 'Circle SMT Progress Detail',
    body: (
      <>
        <Stats
          two
          items={[
            { v: '12', l: 'Visits This Month', tone: 'warn' },
            { v: '20', l: 'Target' },
          ]}
        />
        <h4>Recent Visits · This Circle</h4>
        <table className="dr-tbl">
          <thead>
            <tr>
              <th>Area</th>
              <th>Done By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Patna Central</td>
              <td>Rupesh Kumar</td>
              <td>3 days ago</td>
            </tr>
            <tr>
              <td>Muzaffarpur MSC</td>
              <td>Rupesh Kumar</td>
              <td>5 days ago</td>
            </tr>
            <tr>
              <td>Gaya Store</td>
              <td>Sanjay B.</td>
              <td>8 days ago</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
    actions: [{ label: 'Assign Additional SMT Visits' }],
  },

  'user-detail': {
    crumb: 'Directory › User',
    title: 'User Compliance Detail',
    body: (
      <>
        <table className="dr-tbl">
          <tbody>
            <tr>
              <td className="strong">Name</td>
              <td>Vaibhav Sawant</td>
            </tr>
            <tr>
              <td className="strong">Employee ID</td>
              <td>55003257</td>
            </tr>
            <tr>
              <td className="strong">Type</td>
              <td>Internal FTE</td>
            </tr>
            <tr>
              <td className="strong">Circle</td>
              <td>Maharashtra & Goa</td>
            </tr>
            <tr>
              <td className="strong">Role</td>
              <td>Territory Sales Executive</td>
            </tr>
            <tr>
              <td className="strong">Line Manager</td>
              <td>Shivaji Bakale</td>
            </tr>
          </tbody>
        </table>
        <h4>Compliance Status</h4>
        <Note>Fully cleared user. Next KRCC renewal due: 14 Mar 2027.</Note>
      </>
    ),
  },

  _default: {
    crumb: 'M-Safe',
    title: 'Details',
    body: (
      <Note>
        Drill-down view. Connected live records will appear here once API wiring is complete.
      </Note>
    ),
  },
};

export function resolveDrill(id: string, overrideTitle?: string): DrillDef {
  const base = DRILL_CONTENT[id] || DRILL_CONTENT._default;
  if (overrideTitle && id === 'user-detail') {
    return { ...base, title: overrideTitle };
  }
  if (overrideTitle && (id === 'smt-visit' || id === 'smt-below' || id === 'circle-underperform')) {
    // Keep canonical title for circle-underperform (matches replica); use override for visit/below context
    if (id === 'circle-underperform') return base;
    return { ...base, title: overrideTitle };
  }
  return base;
}
