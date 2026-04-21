import React from 'react';

const PostPossessionFeaturesTab: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    "s11": {
      "borderBottom": "1px solid #d9d9d9",
      "backgroundColor": "#d9e2f3",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s6": {
      "borderBottom": "1px solid #d9d9d9",
      "borderRight": "1px solid #d9d9d9",
      "backgroundColor": "#d9e2f3",
      "textAlign": "center",
      "fontWeight": "bold",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "11pt",
      "verticalAlign": "bottom",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    },
    "s2": {
      "backgroundColor": "#1f3864",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#ffffff",
      "fontFamily": "Arial",
      "fontSize": "11pt",
      "verticalAlign": "middle",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    },
    "s10": {
      "backgroundColor": "#ffffff",
      "textAlign": "left",
      "color": "#000000",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s7": {
      "borderBottom": "1px solid #d9d9d9",
      "borderRight": "1px solid #d9d9d9",
      "backgroundColor": "#ddebf7",
      "textAlign": "left",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s1": {
      "borderLeft": "none",
      "backgroundColor": "#1f3864",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#ffffff",
      "fontFamily": "Arial",
      "fontSize": "11pt",
      "verticalAlign": "middle",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    },
    "s0": {
      "borderRight": "none",
      "backgroundColor": "#1f3864",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#ffffff",
      "fontFamily": "Arial",
      "fontSize": "11pt",
      "verticalAlign": "middle",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    },
    "s3": {
      "borderRight": "1px solid #000000",
      "backgroundColor": "#1f3864",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#ffffff",
      "fontFamily": "Arial",
      "fontSize": "11pt",
      "verticalAlign": "middle",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    },
    "s8": {
      "borderBottom": "1px solid #d9d9d9",
      "borderRight": "1px solid #d9d9d9",
      "backgroundColor": "#ddebf7",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#1f4e78",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s4": {
      "borderBottom": "1px solid #d9d9d9",
      "backgroundColor": "#d9e2f3",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "12pt",
      "verticalAlign": "bottom",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    },
    "s9": {
      "borderBottom": "1px solid #d9d9d9",
      "borderRight": "1px solid #d9d9d9",
      "backgroundColor": "#ffffff",
      "textAlign": "left",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s12": {
      "borderBottom": "1px solid #d9d9d9",
      "borderRight": "1px solid #d9d9d9",
      "backgroundColor": "#d9e2f3",
      "textAlign": "center",
      "fontWeight": "bold",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s13": {
      "backgroundColor": "#d9e2f3",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "10pt",
      "verticalAlign": "middle",
      "whiteSpace": "normal",
      "overflow": "hidden",
      "wordWrap": "break-word",
      "padding": "0px 3px 0px 3px"
    },
    "s5": {
      "backgroundColor": "#d9e2f3",
      "textAlign": "left",
      "fontWeight": "bold",
      "color": "#1f1f1f",
      "fontFamily": "Arial,Arial",
      "fontSize": "12pt",
      "verticalAlign": "bottom",
      "whiteSpace": "nowrap",
      "padding": "0px 3px 0px 3px"
    }
  };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          POST POSSESSION — FULL FEATURE LIST
        </h2>
      </div>

      <table
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', minWidth: '1400px', backgroundColor: 'white' }}
        cellSpacing={0}
        cellPadding={0}
      >
        <colgroup>
          <col style={{ width: '293px' }} />
          <col style={{ width: '292px' }} />
          <col style={{ width: '347px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '83px' }} />
          <col style={{ width: '69px' }} />
          <col style={{ width: '96px' }} />
          <col style={{ width: '363px' }} />
          <col style={{ width: '60px' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '20px' }}>
            <td style={styles.s4}>Visitor Management</td>
            <td style={styles.s4}></td>
            <td style={styles.s4}></td>
            <td style={styles.s4}></td>
            <td style={styles.s4}></td>
            <td style={styles.s4}></td>
            <td style={styles.s4}></td>
            <td style={styles.s4}></td>
            <td style={styles.s5}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s6}>Feature Group</td>
            <td style={styles.s6}>Sub Feature</td>
            <td style={styles.s6}>Description</td>
            <td style={styles.s6}>USP</td>
            <td style={styles.s6}>User Type</td>
            <td style={styles.s6}>Status</td>
            <td style={styles.s6}>Priority</td>
            <td style={styles.s6}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>Pre-Authorised Visitor Management</td>
            <td style={styles.s7}>Residents pre-register expected guests and the guard is notified automatically on arrival.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Includes favourite visitor option</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>Unexpected Visitor Management</td>
            <td style={styles.s7}>The guard alerts the resident by push or IVR so the resident can approve or reject in real time.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Two-tier security alert system</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>OTP-Based Visitor Authentication</td>
            <td style={styles.s7}>Visitor presents an OTP at the gate and the guard validates it before entry.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / Visitor</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Eliminates impersonation at gate</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>IVR Calls / Push Notifications for Approval</td>
            <td style={styles.s7}>Resident receives IVR call or push notification to approve or reject entry.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Works even without smartphone data</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Visitor Entry and Approval</td>
            <td style={styles.s9}>Seeking Invite</td>
            <td style={styles.s9}>Visitor requests entry and the resident receives an invite request to approve.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Visitor / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Visitor initiated flow</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>Request Visit Code</td>
            <td style={styles.s7}>Resident generates a time-limited code for visitor entry.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>One-time secure access</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>e-Intercom</td>
            <td style={styles.s7}>Digital intercom inside the app between resident and guard or visitor.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Replaces physical intercom hardware</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Visitor Entry and Approval</td>
            <td style={styles.s7}>Resident-to-Resident Calling</td>
            <td style={styles.s7}>In-app calling between residents without sharing personal numbers.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Privacy-preserving communication</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Gate Pass and Logs</td>
            <td style={styles.s7}>Digital Gate Pass</td>
            <td style={styles.s7}>Approved visitors receive a timestamped digital pass.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / Visitor</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Replaces paper registers</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Gate Pass and Logs</td>
            <td style={styles.s9}>Digital Logs</td>
            <td style={styles.s9}>All entry and exit events are stored digitally and can be searched or downloaded.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Audit-ready log</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Gate Pass and Logs</td>
            <td style={styles.s7}>Goods In/Out Movement Tracing</td>
            <td style={styles.s7}>Logs all goods entering or leaving the community with timestamps.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Covers movers, deliveries, contractors</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Gate Pass and Logs</td>
            <td style={styles.s9}>Group Visitor Entry</td>
            <td style={styles.s9}>Single entry log for a group arriving together.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Useful for events and bulk visits</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Gate Pass and Logs</td>
            <td style={styles.s9}>Quick Visitor Categories</td>
            <td style={styles.s9}>One-tap creation for delivery, courier, domestic staff and similar visitors.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Reduces guard data entry time</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Gate Pass and Logs</td>
            <td style={styles.s9}>Voice Command Entry</td>
            <td style={styles.s9}>Guard can create visitor logs by voice command.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Helps during peak hours</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Gate Pass and Logs</td>
            <td style={styles.s7}>Leave at Gate</td>
            <td style={styles.s7}>Resident can authorize an item to be left at the gate without entry.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P2</td>
            <td style={styles.s7}>Convenience when resident is away</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Overstay Alerts</td>
            <td style={styles.s7}>Automated alert is triggered when a visitor exceeds the approved duration.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Security compliance feature</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Pre-Authorised Cab Entry</td>
            <td style={styles.s7}>Resident pre-approves a cab before arrival.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Seamless cab access</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Frequent Visitor Pass</td>
            <td style={styles.s7}>System issues a pass for repeat visitors such as vendors or tutors.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Reduces daily approval overhead</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Security and Safety</td>
            <td style={styles.s9}>Favourite Visitor</td>
            <td style={styles.s9}>Residents mark frequent guests as favourites for faster approval.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Convenience feature</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Security and Safety</td>
            <td style={styles.s9}>Temperature Capture</td>
            <td style={styles.s9}>Guard records visitor temperature at entry.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Health compliance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Security and Safety</td>
            <td style={styles.s9}>Mask Check</td>
            <td style={styles.s9}>Guard verifies mask compliance at entry.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Health protocol enforcement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Panic Button</td>
            <td style={styles.s7}>Resident or guard triggers a security alert to all admins.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Emergency response capability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Pre-Approvals for Exit of Children</td>
            <td style={styles.s7}>Resident pre-authorises which adults can take a child out.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Child safety control</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Child Safety Alert</td>
            <td style={styles.s7}>Alert is triggered if child exit does not match the pre-approved list.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Critical safety feature</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Security and Safety</td>
            <td style={styles.s7}>Offline Mode</td>
            <td style={styles.s7}>Guard app works with limited or no network connectivity.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Strong low-connectivity differentiator</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11} colSpan={8}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Attendance and Verification</td>
            <td style={styles.s7}>Staff Attendance</td>
            <td style={styles.s7}>Digital attendance log for domestic staff with verification.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Selfie-based verification included</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Attendance and Verification</td>
            <td style={styles.s7}>Selfie-Based Attendance</td>
            <td style={styles.s7}>Staff marks attendance using selfie-based verification, GPS tagged.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Biometric-equivalent without hardware</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Access and Permissions</td>
            <td style={styles.s7}>Staff Access Management</td>
            <td style={styles.s7}>Define which wings or floors each staff member can access.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Granular access control</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Access and Permissions</td>
            <td style={styles.s7}>Rule-Based Time Allocation</td>
            <td style={styles.s7}>Set permitted entry and exit time windows for each staff member.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Prevents off-hours access</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Access and Permissions</td>
            <td style={styles.s9}>Shared / Personal Staff Classification</td>
            <td style={styles.s9}>Classify staff as shared community staff or resident-specific staff.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Billing and access clarity</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Safety and Monitoring</td>
            <td style={styles.s7}>Block / Red-Flag Staff</td>
            <td style={styles.s7}>Flag or block a staff member from entry across the community.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Community-wide safety control</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Safety and Monitoring</td>
            <td style={styles.s7}>Staff Entry / Exit Notification</td>
            <td style={styles.s7}>Resident receives notifications when registered staff enters or exits.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Real-time domestic staff monitoring</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Staff Lifecycle</td>
            <td style={styles.s9}>Staff Roster Management</td>
            <td style={styles.s9}>Manage planned and unplanned leaves and holidays for staff.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Prevents unstaffed shifts</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Staff Lifecycle</td>
            <td style={styles.s9}>Staff Rating</td>
            <td style={styles.s9}>Resident rates domestic staff after each visit.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Quality signal</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Staff Lifecycle</td>
            <td style={styles.s9}>Daily Helps Payment &amp;amp; Recording</td>
            <td style={styles.s9}>Log payment made to daily help staff and maintain records.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Financial accountability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Helpdesk</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Ticket Creation and Triage</td>
            <td style={styles.s7}>Ticket Creation (Multi-Mode)</td>
            <td style={styles.s7}>Residents raise complaints or requests with photo, video, or audio attachments.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Lowers reporting friction</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Ticket Creation and Triage</td>
            <td style={styles.s9}>Classification: Complaint / Suggestion / Request</td>
            <td style={styles.s9}>Tickets are categorized at creation for clean triage.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Better workflow routing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Ticket Creation and Triage</td>
            <td style={styles.s7}>Priority Assignment</td>
            <td style={styles.s7}>Admin assigns High, Medium, or Low priority to each ticket.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>SLA-driven operations</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Ticket Creation and Triage</td>
            <td style={styles.s7}>Rule-Based Auto Ticket Assignment</td>
            <td style={styles.s7}>Tickets are auto-routed to relevant vendor or staff based on category and location.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Zero manual dispatch</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Escalation and SLA</td>
            <td style={styles.s7}>5-Layer Escalation Matrix (FM)</td>
            <td style={styles.s7}>Automated escalation through five levels if the ticket is not resolved in time.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Prevents tickets from being missed</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Escalation and SLA</td>
            <td style={styles.s7}>5-Layer Escalation Matrix (Project Team)</td>
            <td style={styles.s7}>Separate escalation path for project or developer-level issues.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Developer</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Developer accountability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Escalation and SLA</td>
            <td style={styles.s7}>TAT Calculation (Operational Days and Time)</td>
            <td style={styles.s7}>Resolution time is calculated based on defined operational hours.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Fair SLA measurement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Escalation and SLA</td>
            <td style={styles.s7}>Executive Escalation</td>
            <td style={styles.s7}>Unresolved critical issues can be escalated to community head or branch director.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Senior accountability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Quality and Compliance</td>
            <td style={styles.s7}>CAPA Reporting Compliance</td>
            <td style={styles.s7}>Corrective and preventive action reporting is maintained per ticket.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Compliance-grade documentation</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Quality and Compliance</td>
            <td style={styles.s7}>Root Cause Analysis</td>
            <td style={styles.s7}>FM logs root cause for recurring issues.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Reduces repeat complaints</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Resolution and Feedback</td>
            <td style={styles.s7}>Vendor Assignment</td>
            <td style={styles.s7}>A specific vendor or technician can be assigned to a ticket.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Accountability and tracking</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resolution and Feedback</td>
            <td style={styles.s9}>Re-open Ticket</td>
            <td style={styles.s9}>Resident or admin can reopen a closed ticket if the issue recurs.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Prevents false closure</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resolution and Feedback</td>
            <td style={styles.s9}>Ticket Feedback</td>
            <td style={styles.s9}>Resident rates resolution quality after closure.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>NPS-style feedback</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Resolution and Feedback</td>
            <td style={styles.s7}>Real-Time Analytical Report</td>
            <td style={styles.s7}>Live dashboard of ticket status, TAT, and category breakdown.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Management visibility</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Resident Priority Handling</td>
            <td style={styles.s7}>Golden Ticket</td>
            <td style={styles.s7}>Tickets from senior citizens, differently-abled, and pregnant residents are flagged urgently.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Inclusive priority care</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Accounting</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Billing Setup</td>
            <td style={styles.s9}>CAM Charges Configuration</td>
            <td style={styles.s9}>Define and assign Common Area Maintenance charges per unit type.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Flexible billing setup</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Billing Setup</td>
            <td style={styles.s7}>GST Configuration</td>
            <td style={styles.s7}>GST slabs are configured per charge type and auto-applied to invoices.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Compliance-ready billing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Billing Setup</td>
            <td style={styles.s9}>Tax Slab Setup</td>
            <td style={styles.s9}>Multiple tax slabs can be configured.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Multi-tier tax compliance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Invoicing and Collections</td>
            <td style={styles.s7}>Auto Invoice / Receipt Generation</td>
            <td style={styles.s7}>System auto-generates invoices and receipts on the billing cycle.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Zero manual invoicing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Invoicing and Collections</td>
            <td style={styles.s9}>Part / Full Payment</td>
            <td style={styles.s9}>Residents can pay the full or partial bill amount.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Reduces defaulter ratio</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Invoicing and Collections</td>
            <td style={styles.s7}>Multiple Payment Gateway Support</td>
            <td style={styles.s7}>Supports UPI, net banking, cards, and other configured payment modes.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Reduces payment friction</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Invoicing and Collections</td>
            <td style={styles.s7}>Direct Settlement in Client Bank Account</td>
            <td style={styles.s7}>Payments settle directly to the developer or RWA bank account.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Financial sovereignty</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Invoicing and Collections</td>
            <td style={styles.s9}>Payment Reminders</td>
            <td style={styles.s9}>Auto SMS and push reminders before and after due dates.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Reduces delinquency</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Invoicing and Collections</td>
            <td style={styles.s9}>Offline Payment Reconciliation</td>
            <td style={styles.s9}>Cash and cheque payments can be logged and reconciled.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Supports non-digital payers</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Accounting and Reporting</td>
            <td style={styles.s9}>Transaction Management</td>
            <td style={styles.s9}>All financial transactions are logged in one place.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Single source of truth</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Accounting and Reporting</td>
            <td style={styles.s9}>Income / Expense Reports</td>
            <td style={styles.s9}>Reports are available by category and time period.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Audit-ready books</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Accounting and Reporting</td>
            <td style={styles.s7}>Assets and Liabilities Management</td>
            <td style={styles.s7}>Tracks community assets and liabilities on the balance sheet.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Full accounting module</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Accounting and Reporting</td>
            <td style={styles.s9}>Chart of Accounts</td>
            <td style={styles.s9}>Structured account heads for community accounting.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Standard accounting framework</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Integrations and Recovery</td>
            <td style={styles.s7}>ERP Export</td>
            <td style={styles.s7}>Accounting data can be exported to ERP systems such as Tally or SAP.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Integrates with developer systems</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Integrations and Recovery</td>
            <td style={styles.s7}>Defaulter Blocking</td>
            <td style={styles.s7}>Defaulting residents can be blocked from raising new service requests.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Enforcement mechanism</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Integrations and Recovery</td>
            <td style={styles.s7}>Prepaid Meter Integration</td>
            <td style={styles.s7}>Prepaid electricity meters can be linked to the billing module.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Automated utility billing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Communication</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Notices and Announcements</td>
            <td style={styles.s7}>e-Notices with Attachments</td>
            <td style={styles.s7}>Admin sends notices with PDF or image attachments, with read and unread tracking.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Replaces paper boards and WhatsApp groups</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Notices and Announcements</td>
            <td style={styles.s9}>Delivery Reports</td>
            <td style={styles.s9}>Track which residents have read a notice.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Admin accountability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Notices and Announcements</td>
            <td style={styles.s9}>Community News / Announcements</td>
            <td style={styles.s9}>Broadcast updates to all residents.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Keeps residents informed</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Events and Engagement</td>
            <td style={styles.s9}>Events</td>
            <td style={styles.s9}>Create community events, with RSVP, like, and share actions.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Community engagement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Events and Engagement</td>
            <td style={styles.s9}>Polls</td>
            <td style={styles.s9}>Admin or authorised user creates polls and residents vote in-app.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Digital decision-making</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Events and Engagement</td>
            <td style={styles.s9}>Gallery</td>
            <td style={styles.s9}>Residents can view and share community photos.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Digital community album</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Events and Engagement</td>
            <td style={styles.s7}>Meeting (MoM)</td>
            <td style={styles.s7}>Minutes of meeting can be logged and converted into tasks with owners and deadlines.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Action-oriented records</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Events and Engagement</td>
            <td style={styles.s9}>Wellness Programs (Webinars)</td>
            <td style={styles.s9}>Free consultation or webinar slots can be offered by experts.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Value-add engagement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Events and Engagement</td>
            <td style={styles.s9}>Offers / Coupons</td>
            <td style={styles.s9}>Admin can configure special discount coupons for residents.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Loyalty and engagement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Engagement and Collaboration</td>
            <td style={styles.s7}>Collaboration (Chat + Video)</td>
            <td style={styles.s7}>In-app chat with conversation trail and quick video call support.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P2</td>
            <td style={styles.s7}>Reduces reliance on WhatsApp</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Facility Booking</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Amenity Booking</td>
            <td style={styles.s7}>Facility Booking</td>
            <td style={styles.s7}>Residents book clubhouse, gym, and other amenities from the app.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Self-service amenity booking</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Amenity Booking</td>
            <td style={styles.s7}>Bookable vs Requestable Config</td>
            <td style={styles.s7}>Admin can mark each facility as directly bookable or approval-required.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Flexible facility management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Amenity Booking</td>
            <td style={styles.s9}>Slot Capacity Management</td>
            <td style={styles.s9}>Maximum occupancy can be set per slot to prevent overbooking.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Safety and fairness</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Amenity Booking</td>
            <td style={styles.s9}>Sub-Facility Management</td>
            <td style={styles.s9}>Admin can manage sub-areas within a facility.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Granular booking control</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Membership and Usage</td>
            <td style={styles.s7}>Club Membership Management</td>
            <td style={styles.s7}>Club membership, expiry alerts, and renewals are tracked.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Membership lifecycle management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Membership and Usage</td>
            <td style={styles.s7}>Automated Usage-Based Charges</td>
            <td style={styles.s7}>Facility charges can be auto-calculated based on usage duration.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Revenue recovery</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Access Control</td>
            <td style={styles.s7}>Unique Resident QR Code</td>
            <td style={styles.s7}>Each resident gets a QR code for amenity access verification.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Contactless access control</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Guard Patrolling</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Patrol Logging</td>
            <td style={styles.s7}>QR Code-Based Guard Patrolling</td>
            <td style={styles.s7}>Guards scan QR codes at checkpoints to log patrol rounds.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Verifiable patrolling without paper</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Patrol Logging</td>
            <td style={styles.s9}>Parking Area Audit</td>
            <td style={styles.s9}>Guard logs status of member parking areas during patrol.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Parking compliance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Patrol Logging</td>
            <td style={styles.s9}>No Honking Zone Audit</td>
            <td style={styles.s9}>Guard logs violations in designated no-honking zones.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Community compliance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Patrol Logging</td>
            <td style={styles.s9}>Vehicle Movement Audit</td>
            <td style={styles.s9}>Tracks vehicle movement patterns during patrol.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard / FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Security intelligence</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Vehicle Management</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Entry and Exit Control</td>
            <td style={styles.s7}>Vehicle Entry / Exit Management</td>
            <td style={styles.s7}>Logs all vehicle movements with timestamps.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Full vehicle audit trail</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Entry and Exit Control</td>
            <td style={styles.s7}>Boom Barrier / RFID Integration</td>
            <td style={styles.s7}>Integrates with boom barriers and RFID readers.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Automated vehicle access</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Parking Administration</td>
            <td style={styles.s7}>Parking Allocation</td>
            <td style={styles.s7}>Assigns parking slots to residents and maps them to flats.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Eliminates disputes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Parking Administration</td>
            <td style={styles.s9}>Smart Parking Configuration</td>
            <td style={styles.s9}>Configure parking zones, types, and allocation rules.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Optimises utilisation</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Parking Administration</td>
            <td style={styles.s9}>Visitor Parking Allocation</td>
            <td style={styles.s9}>Temporary parking slots can be assigned to visitors.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Managed visitor parking</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Parking Administration</td>
            <td style={styles.s9}>Real-Time Parking View</td>
            <td style={styles.s9}>Live view of occupied and free parking slots.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Reduces parking disputes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Parking Administration</td>
            <td style={styles.s9}>Vehicle Type Classification</td>
            <td style={styles.s9}>Vehicles can be classified by type such as 2-wheeler, 4-wheeler, or EV.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Organised parking management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Parking Administration</td>
            <td style={styles.s9}>Parking Charges Configuration</td>
            <td style={styles.s9}>Parking fees can be configured by vehicle type or slot.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Revenue recovery</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Self-Service</td>
            <td style={styles.s9}>Resident Vehicle Update via App</td>
            <td style={styles.s9}>Residents can add or update their vehicles from the app.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Self-service vehicle management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Asset Management</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Asset Registry</td>
            <td style={styles.s7}>Asset Tagging and Registration</td>
            <td style={styles.s7}>All assets are registered with QR code tags.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Single source of asset truth</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Asset Registry</td>
            <td style={styles.s9}>Bulk Upload</td>
            <td style={styles.s9}>Large asset lists can be uploaded through a template.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Fast onboarding for large communities</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Maintenance and Alerts</td>
            <td style={styles.s7}>Warranty / Guarantee Alerts</td>
            <td style={styles.s7}>Alerts are generated before warranty expiry.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Prevents missed renewals</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Maintenance and Alerts</td>
            <td style={styles.s9}>Asset Maintenance Scheduling</td>
            <td style={styles.s9}>Preventive maintenance can be scheduled for each asset.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Planned maintenance over reactive</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Maintenance and Alerts</td>
            <td style={styles.s9}>Asset Categorisation</td>
            <td style={styles.s9}>Assets can be flagged as critical or non-critical.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Risk-based maintenance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Documentation</td>
            <td style={styles.s7}>Asset Information Repository</td>
            <td style={styles.s7}>Manuals, invoices, and AMC documents are stored centrally.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>All asset documents in one place</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Digital Checklist</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Checklist Execution</td>
            <td style={styles.s7}>PPM / AMC / Preparedness Checklists</td>
            <td style={styles.s7}>Digital checklists for planned preventive maintenance and compliance tasks.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Compliance-grade maintenance records</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Checklist Execution</td>
            <td style={styles.s7}>Auto Task Assignment</td>
            <td style={styles.s7}>Checklist tasks are assigned automatically based on role and roster.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Zero manual dispatch</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Checklist Execution</td>
            <td style={styles.s7}>QR / NFC + Supervisor Verification</td>
            <td style={styles.s7}>Technician scan plus supervisor verification prevents false completion.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Dual-control workflow</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Checklist Execution</td>
            <td style={styles.s9}>Grace Period and Locking</td>
            <td style={styles.s9}>Tasks can have a grace period after which they lock automatically.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>SLA enforcement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Checklist Execution</td>
            <td style={styles.s9}>Email Reminders</td>
            <td style={styles.s9}>Auto reminders are sent to vendors and FM teams for pending tasks.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Reduces missed tasks</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Soft Services</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Service Scheduling</td>
            <td style={styles.s9}>Soft Service Scheduling</td>
            <td style={styles.s9}>Housekeeping, pest control, landscaping, and similar tasks can be scheduled.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Planned soft service operations</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Service Scheduling</td>
            <td style={styles.s9}>Automated Soft Service Alerts</td>
            <td style={styles.s9}>Reminders are generated for upcoming service tasks.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Prevents missed schedules</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Service Scheduling</td>
            <td style={styles.s9}>Checklist Maintenance</td>
            <td style={styles.s9}>Digital checklists are used for service execution.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Verifiable service delivery</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Meter Management</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Meter Operations</td>
            <td style={styles.s9}>Meter Reading Logs</td>
            <td style={styles.s9}>Meter readings are logged with timestamps.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Accurate utility billing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Meter Operations</td>
            <td style={styles.s9}>Parent / Sub Meter Tagging</td>
            <td style={styles.s9}>Sub-meters can be linked to parent meters.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Multi-level utility monitoring</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Meter Operations</td>
            <td style={styles.s9}>Min / Max Alert Levels</td>
            <td style={styles.s9}>Alerts are triggered when consumption crosses thresholds.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Leak or theft detection</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Meter Operations</td>
            <td style={styles.s9}>Utility Consumption Reports</td>
            <td style={styles.s9}>Tower-wise and meter-wise monthly consumption reports are available.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Utility cost management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Inventory</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Procurement and Stock</td>
            <td style={styles.s9}>PO / WO Management</td>
            <td style={styles.s9}>Purchase orders and work orders can be raised and tracked.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Formalised procurement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Procurement and Stock</td>
            <td style={styles.s9}>Spares / Consumables Tracking</td>
            <td style={styles.s9}>Spare parts and consumables usage is tracked.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Prevents stock-outs</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Procurement and Stock</td>
            <td style={styles.s9}>GRN / GDN Tracking</td>
            <td style={styles.s9}>Goods received notes and goods dispatch notes are logged.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Audit-ready inventory flow</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Procurement and Stock</td>
            <td style={styles.s9}>Insufficient Stock Alerts</td>
            <td style={styles.s9}>Alerts are generated when stock falls below minimum level.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Prevents operational disruption</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Cost Approval</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Expense Governance</td>
            <td style={styles.s9}>R&amp;amp;M Cost Tracking</td>
            <td style={styles.s9}>Repair and maintenance costs are tracked.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Financial visibility for FM</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Expense Governance</td>
            <td style={styles.s7}>Multi-Layer Cost Approval</td>
            <td style={styles.s7}>Role-based approval hierarchy is available for spends.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Financial governance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Expense Governance</td>
            <td style={styles.s9}>Cost Approval Reports</td>
            <td style={styles.s9}>Reports show approved, rejected, and pending approvals.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Audit trail for spends</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Fitout</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Fitout Workflow</td>
            <td style={styles.s7}>Fitout Request</td>
            <td style={styles.s7}>Residents submit fitout or renovation requests through the app.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Controlled renovation process</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Fitout Workflow</td>
            <td style={styles.s7}>Deviation Checklist and Notice</td>
            <td style={styles.s7}>Admin checks deviations from approved plan and issues notice.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Compliance enforcement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Fitout Workflow</td>
            <td style={styles.s9}>Auto SOP and Manuals</td>
            <td style={styles.s9}>SOPs and manuals are shared automatically with fitout contractors.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Contractor</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Consistent contractor briefing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Fitout Workflow</td>
            <td style={styles.s9}>Fitout Labour Request</td>
            <td style={styles.s9}>Residents can request skilled labour through the app.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Curated contractor access</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Incident Management</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Incident Capture and Escalation</td>
            <td style={styles.s7}>Incident Reporting</td>
            <td style={styles.s7}>Incidents can be logged with property, location, category, and sub-category, plus voice note support.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Structured incident documentation</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Incident Capture and Escalation</td>
            <td style={styles.s7}>Incident Escalation and Approval</td>
            <td style={styles.s7}>Critical incidents can be escalated to branch director with approve or reject workflow.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Senior visibility on incidents</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>BI Reporting</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Analytics and Export</td>
            <td style={styles.s7}>BI Reports</td>
            <td style={styles.s7}>Multi-module live dashboards are available for operations and management.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / FM / Developer</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>360-degree intelligence</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Analytics and Export</td>
            <td style={styles.s9}>Underlying Data Export</td>
            <td style={styles.s9}>Raw data can be exported in Excel, CSV, or PDF.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Data portability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Analytics and Export</td>
            <td style={styles.s9}>Multi-Format Chart Views</td>
            <td style={styles.s9}>Reports can be viewed as bar, line, pie, and other chart types.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Visual analytics</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Services Marketplace</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>On-Premise Services</td>
            <td style={styles.s7}>On-Premise Services</td>
            <td style={styles.s7}>Residents can book services such as deep cleaning, laundry, or similar offerings.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Curated service marketplace</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>On-Premise Services</td>
            <td style={styles.s9}>Service Slot Scheduling</td>
            <td style={styles.s9}>Admin creates concurrent service slots based on staff bandwidth.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Capacity-managed service delivery</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>On-Premise Services</td>
            <td style={styles.s9}>Service Invoice and Receipt Download</td>
            <td style={styles.s9}>Residents can download invoices and receipts from the app.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Full transaction transparency</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>On-Premise Services</td>
            <td style={styles.s9}>Service Feedback</td>
            <td style={styles.s9}>Residents can rate and comment on services received.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Quality control signal</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Food and Beverage</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Restaurant Experience</td>
            <td style={styles.s7}>Food Ordering</td>
            <td style={styles.s7}>Residents can order food from on-site restaurants through the app.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P2</td>
            <td style={styles.s7}>Convenience and revenue potential</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Restaurant Experience</td>
            <td style={styles.s9}>Restaurant Table Booking</td>
            <td style={styles.s9}>Tables can be booked at on-site restaurants.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Reduces walk-in crowd management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Restaurant Experience</td>
            <td style={styles.s9}>Multi-Restaurant Configuration</td>
            <td style={styles.s9}>Multiple restaurants can be configured with separate menus and hours.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Flexibility for large townships</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Restaurant Experience</td>
            <td style={styles.s9}>Menu Upload and Gallery</td>
            <td style={styles.s9}>Admin uploads menu items with images and categories.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Rich menu experience</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Restaurant Experience</td>
            <td style={styles.s9}>Table Booking T&amp;amp;C and Capacity</td>
            <td style={styles.s9}>Minimum and maximum pax, blocked days, and terms can be configured.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Controlled booking experience</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Convenience</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Local Directory and Access</td>
            <td style={styles.s7}>Hyper-Local Directory</td>
            <td style={styles.s7}>Category-wise directory of local service providers with quick-call support.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Replaces the need to search elsewhere</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Local Directory and Access</td>
            <td style={styles.s9}>Click to Order</td>
            <td style={styles.s9}>Integrated ordering for groceries or utilities from within the app.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>E-commerce convenience</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Local Directory and Access</td>
            <td style={styles.s7}>Quick Call</td>
            <td style={styles.s7}>Single-tap access to important community contact numbers.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Emergency readiness</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Digital Documents</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Repository and Sharing</td>
            <td style={styles.s7}>Common Document Repository</td>
            <td style={styles.s7}>Community-level documents such as rules, minutes, and reports are shared centrally.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Paperless governance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Repository and Sharing</td>
            <td style={styles.s9}>Flat-Wise Document Sharing</td>
            <td style={styles.s9}>Flat-specific documents such as allotment letters or NOCs can be shared.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Personalized document delivery</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>White Label and Brand</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>App Branding</td>
            <td style={styles.s7}>White-Label Android App</td>
            <td style={styles.s7}>Developer-branded Android app with custom splash, logo, and colors.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Developer</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Brand visibility post-possession</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>App Branding</td>
            <td style={styles.s7}>White-Label iOS App</td>
            <td style={styles.s7}>Developer-branded iOS app.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Developer</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Brand presence in Apple ecosystem</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>App Branding</td>
            <td style={styles.s9}>Rolling Banners</td>
            <td style={styles.s9}>Home screen banners can be configured by the developer for promotions.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Developer</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>In-app marketing space</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>e-Marketing</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Referral and Growth</td>
            <td style={styles.s7}>Referral Marketing</td>
            <td style={styles.s7}>Residents can refer friends and the referrals can be tracked or rewarded.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Developer / Resident</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Turns residents into a sales channel</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Referral and Growth</td>
            <td style={styles.s7}>New Project Updates</td>
            <td style={styles.s7}>New launch updates can be pushed to existing residents.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Developer</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Warm audience for launches</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Referral and Growth</td>
            <td style={styles.s7}>New Lead Generation</td>
            <td style={styles.s7}>Resident referrals can be captured and forwarded to the sales CRM.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Developer</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P0</td>
            <td style={styles.s7}>Direct pipeline contribution</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Referral and Growth</td>
            <td style={styles.s9}>Customer Loyalty Program</td>
            <td style={styles.s9}>Points, rewards, and recognition can be used to retain residents.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Developer / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Retention and advocacy</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Referral and Growth</td>
            <td style={styles.s9}>Marketing Analytics</td>
            <td style={styles.s9}>Engagement, referral conversion, and campaign performance can be tracked.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Developer</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Data-driven marketing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Project Setup</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Project Structure</td>
            <td style={styles.s9}>Flat / Tower Creation</td>
            <td style={styles.s9}>Create towers, wings, and flat structures for the project.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Foundational master data</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Project Structure</td>
            <td style={styles.s9}>Bulk Upload Units</td>
            <td style={styles.s9}>Upload flat and tower data through a template.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Fast onboarding</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Project Structure</td>
            <td style={styles.s9}>Occupancy Status Tracking</td>
            <td style={styles.s9}>Mark units as vacant, owner-occupied, or tenant-occupied.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Operational clarity</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Project Structure</td>
            <td style={styles.s9}>e-Group Creation</td>
            <td style={styles.s9}>Create communication groups such as tower or floor groups.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Targeted communication</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>User Setup</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Records</td>
            <td style={styles.s9}>Owner Profiling</td>
            <td style={styles.s9}>Create and manage owner profiles with full details.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Master resident database</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Records</td>
            <td style={styles.s9}>Tenant Profiling</td>
            <td style={styles.s9}>Create tenant profiles linked to the unit and lease details.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Tenant traceability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Records</td>
            <td style={styles.s9}>Tenant Lease Expiry Notification</td>
            <td style={styles.s9}>Lease expiry reminders are triggered before the agreement ends.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Lease compliance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Records</td>
            <td style={styles.s9}>Bulk Upload Users</td>
            <td style={styles.s9}>Upload resident data through a template.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P0</td>
            <td style={styles.s9}>Fast resident onboarding</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Records</td>
            <td style={styles.s9}>Primary / Secondary Member Classification</td>
            <td style={styles.s9}>Classify family members as primary or secondary members.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Correct access and billing</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Resident Records</td>
            <td style={styles.s9}>Switch Flats</td>
            <td style={styles.s9}>Multi-flat residents can switch context without re-login.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Convenience for owners with multiple units</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Compliance and Governance</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Work Permits and Audits</td>
            <td style={styles.s7}>Permit to Work</td>
            <td style={styles.s7}>Digital PTW for hazardous work with risk identification and authorization.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Regulatory compliance for FM</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Work Permits and Audits</td>
            <td style={styles.s9}>Vendor Evaluation Checklist</td>
            <td style={styles.s9}>Create and fill a digital vendor evaluation checklist with PDF output.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Structured vendor performance management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Work Permits and Audits</td>
            <td style={styles.s9}>Vendor Evaluation Approval</td>
            <td style={styles.s9}>Vendor evaluation can be approved or rejected through email.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Remote sign-off</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Work Permits and Audits</td>
            <td style={styles.s9}>Operational Audit Scheduling</td>
            <td style={styles.s9}>Schedule and assign audits to community leaders or FM teams.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Proactive compliance management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Work Permits and Audits</td>
            <td style={styles.s9}>Audit Report Download</td>
            <td style={styles.s9}>Completed audit reports can be downloaded as PDF.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Audit trail support</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Project Operations</td>
            <td style={styles.s9}>Project and Task Management</td>
            <td style={styles.s9}>Add, assign, and track tasks with escalation and project-wise reports.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Cross-team operational management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Project Operations</td>
            <td style={styles.s7}>MoM Auto Task Creation</td>
            <td style={styles.s7}>Minutes of meeting can auto-create tasks with owners and target dates.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Converts decisions to actions</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Observation and Snags</td>
            <td style={styles.s9}>Design Input Observation Report</td>
            <td style={styles.s9}>Site observations can be logged with photos and exported as PDF.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Structured snagging for pre-handover</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Compliance Tracker</td>
            <td style={styles.s7}>Compliance Tracker (AMC / Legal)</td>
            <td style={styles.s7}>Alerts are sent for AMC and legal compliance deadlines.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Never miss a deadline</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Mailroom and Goods</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Mail Handling</td>
            <td style={styles.s7}>Mailroom Inbound / Outbound Management</td>
            <td style={styles.s7}>All inbound and outbound mail and packages are logged with OTP verification on delivery.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>FM / Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Complete mailroom digitisation</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Mail Handling</td>
            <td style={styles.s9}>Package Delegation</td>
            <td style={styles.s9}>Residents can authorize another resident to collect a package on their behalf.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Resident convenience</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Goods Movement</td>
            <td style={styles.s7}>Goods Movement Tracker</td>
            <td style={styles.s7}>Entry and exit of goods are tracked in real time with vehicle linkage.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard / FM</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Full goods accountability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Sustainability and Utility</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Sustainability and Tracking</td>
            <td style={styles.s9}>Waste Generation Tracking</td>
            <td style={styles.s9}>Daily waste generation is logged by type.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Sustainability reporting</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Sustainability and Tracking</td>
            <td style={styles.s9}>Utility Consumption Reports</td>
            <td style={styles.s9}>Month-wise power, water, and DG consumption can be reported.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Energy audit capability</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11}>Computer Vision and Integrations</td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s11}></td>
            <td style={styles.s13}></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Surveillance and Access Intelligence</td>
            <td style={styles.s7}>CCTV Surveillance Integration</td>
            <td style={styles.s7}>CCTV feeds can be integrated with computer vision analytics.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>AI-powered physical security</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Surveillance and Access Intelligence</td>
            <td style={styles.s7}>Tailgating Detection</td>
            <td style={styles.s7}>Computer vision detects unauthorized tailgating at access points.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Prevents security breach</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Surveillance and Access Intelligence</td>
            <td style={styles.s7}>ANPR</td>
            <td style={styles.s7}>Number plates are auto-read at entry and exit.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Hands-free vehicle access</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Surveillance and Access Intelligence</td>
            <td style={styles.s9}>Face Mask Detection</td>
            <td style={styles.s9}>Computer vision detects mask non-compliance.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Guard</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Health protocol automation</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Surveillance and Access Intelligence</td>
            <td style={styles.s9}>Social Distancing Monitoring</td>
            <td style={styles.s9}>Computer vision monitors crowding and distance violations.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Health and safety compliance</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Surveillance and Access Intelligence</td>
            <td style={styles.s9}>Heat Mapping</td>
            <td style={styles.s9}>Real-time occupancy heat maps are generated for common areas.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Space utilisation intelligence</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Access Control</td>
            <td style={styles.s7}>Boom Barrier / Flap Barrier Integration</td>
            <td style={styles.s7}>API integration with boom and flap barriers at gates.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin / Guard</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Automated physical access control</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Integrations</td>
            <td style={styles.s7}>IT-IoT Integration</td>
            <td style={styles.s7}>API, ERP, OPC, historian, and third-party system integrations are supported.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>Open integration architecture</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Integrations</td>
            <td style={styles.s7}>Customised IoT</td>
            <td style={styles.s7}>Bespoke IoT solutions can be configured for project-specific needs.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Roadmap</td>
            <td style={styles.s7}>P2</td>
            <td style={styles.s7}>Custom scope per project</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td style={styles.s10}></td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s11} colSpan={8}>Lease, Space, Transport, Procurement, Environment, Health, Partnerships, HRMS</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s12}>Feature Group</td>
            <td style={styles.s12}>Sub Feature</td>
            <td style={styles.s12}>Description</td>
            <td style={styles.s12}>USP</td>
            <td style={styles.s12}>User Type</td>
            <td style={styles.s12}>Status</td>
            <td style={styles.s12}>Priority</td>
            <td style={styles.s12}>Notes</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s7}>Lease Management</td>
            <td style={styles.s7}>Lease Management (Full Module)</td>
            <td style={styles.s7}>End-to-end lease lifecycle management covering operations, accounting, and analytics.</td>
            <td style={styles.s8}>Yes</td>
            <td style={styles.s7}>Admin</td>
            <td style={styles.s7}>Live</td>
            <td style={styles.s7}>P1</td>
            <td style={styles.s7}>For leased units</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Space Management</td>
            <td style={styles.s9}>Space / Seat Management</td>
            <td style={styles.s9}>Seat booking, cancel or reschedule, interactive floor plan, and roster calendar.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Applicable to co-living or mixed-use spaces</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Transport Management</td>
            <td style={styles.s9}>Transport Management System</td>
            <td style={styles.s9}>Bus or cab booking, trip tracking, billing, and policy management.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Community commute management</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Procurement</td>
            <td style={styles.s9}>Procurement (Inventory Request and Approval)</td>
            <td style={styles.s9}>Procurement requests can be raised, approved, and tracked.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>FM / Admin</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P1</td>
            <td style={styles.s9}>Formalised procurement</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Environment</td>
            <td style={styles.s9}>AQI Monitoring</td>
            <td style={styles.s9}>Real-time air quality index mapping is available for the community.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Wellness and safety transparency</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Health</td>
            <td style={styles.s9}>Self Health Declaration</td>
            <td style={styles.s9}>Residents can submit daily health status declarations.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Wellness or pandemic preparedness</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>Partnerships</td>
            <td style={styles.s9}>B2B Health and Grocery Partnerships</td>
            <td style={styles.s9}>Integrated partnerships with grocery and health service providers.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / Resident</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>Curated hyper-local ecosystem</td>
            <td></td>
          </tr>
          <tr style={{ height: '20px' }}>
            <td style={styles.s9}>HRMS</td>
            <td style={styles.s9}>HRMS Integration</td>
            <td style={styles.s9}>Employee database, payroll, and attendance can sync with HRMS.</td>
            <td style={styles.s9}>No</td>
            <td style={styles.s9}>Admin / FM</td>
            <td style={styles.s9}>Live</td>
            <td style={styles.s9}>P2</td>
            <td style={styles.s9}>HR and FM integration</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PostPossessionFeaturesTab;
