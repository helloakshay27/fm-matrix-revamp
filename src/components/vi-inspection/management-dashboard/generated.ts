/* Generated from the Inspection (PGI) dashboard wireframe. Dummy figures only. */
export const GENERATED_CHARTS = {
  "insStatus": {
    "defaultType": "donut",
    "labels": [
      "Draft",
      "Scheduled",
      "Open",
      "Closed"
    ],
    "datasets": [
      {
        "label": "Inspections",
        "data": [
          143,
          120,
          482,
          1115
        ],
        "pieColors": [
          "#F4795F",
          "#9B7FD4",
          "#EE2737",
          "#0D47A1"
        ],
        "barColor": "#EE2737"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "insStage": {
    "defaultType": "donut",
    "labels": [
      "Pending By SPOC",
      "Pending By Action Owner"
    ],
    "datasets": [
      {
        "label": "Open inspections",
        "data": [
          118,
          364
        ],
        "pieColors": [
          "#F9A592",
          "#FDE2C8"
        ],
        "barColor": "#DA7756"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "insType": {
    "defaultType": "donut",
    "labels": [
      "Lobby Inspection",
      "Office Room",
      "Meeting Room Inspection",
      "Other types"
    ],
    "datasets": [
      {
        "label": "Inspections",
        "data": [
          612,
          544,
          438,
          266
        ],
        "pieColors": [
          "#DA7756",
          "#6B9BCC",
          "#798C5E",
          "#CECBF6"
        ],
        "barColor": "#DA7756"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "insTrend": {
    "defaultType": "line",
    "labels": [
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct"
    ],
    "datasets": [
      {
        "label": "Submitted",
        "data": [
          118,
          126,
          131,
          139,
          148,
          152,
          158,
          163,
          157,
          166,
          171,
          178
        ],
        "lineColor": "#DA7756",
        "lineFill": "rgba(218,119,86,.10)",
        "barColor": "#DA7756"
      },
      {
        "label": "Closed",
        "data": [
          72,
          80,
          86,
          92,
          99,
          104,
          110,
          116,
          114,
          121,
          127,
          134
        ],
        "lineColor": "#108C72",
        "lineFill": "rgba(16,140,114,.10)",
        "barColor": "#108C72"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "insCircle": {
    "defaultType": "bar",
    "labels": [
      "Maharashtra & Goa",
      "Tamil Nadu",
      "Karnataka",
      "UP East",
      "UP West",
      "Andhra Pradesh",
      "Delhi NCR",
      "Kolkata",
      "Bihar",
      "Assam",
      "NESA",
      "Kerala"
    ],
    "datasets": [
      {
        "label": "Open",
        "data": [
          38,
          35,
          32,
          29,
          27,
          24,
          22,
          20,
          18,
          16,
          14,
          12
        ],
        "barColor": "#EE2737"
      },
      {
        "label": "Closed",
        "data": [
          88,
          81,
          74,
          68,
          63,
          57,
          52,
          47,
          42,
          38,
          34,
          30
        ],
        "barColor": "#0D47A1"
      }
    ],
    "stacked": true,
    "horizontal": false
  },
  "insFacility": {
    "defaultType": "bar",
    "labels": [
      "Facility type A",
      "Facility type B",
      "Facility type C",
      "Facility type D",
      "Facility type E"
    ],
    "datasets": [
      {
        "label": "Inspections",
        "data": [
          612,
          470,
          356,
          248,
          174
        ],
        "pieColors": [
          "#6B9BCC",
          "#DA7756",
          "#798C5E",
          "#9EC8BA",
          "#CECBF6"
        ],
        "barColor": "#6B9BCC"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "insFunc": {
    "defaultType": "donut",
    "labels": [
      "Sales",
      "Sales & Distribution",
      "Technology",
      "Postpaid",
      "Customer Service",
      "Finance",
      "HR"
    ],
    "datasets": [
      {
        "label": "Inspections",
        "data": [
          520,
          361,
          298,
          240,
          196,
          142,
          103
        ],
        "pieColors": [
          "#DA7756",
          "#798C5E",
          "#6B9BCC",
          "#9EC8BA",
          "#CECBF6",
          "#EDC488",
          "#E7848E"
        ],
        "barColor": "#DA7756"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "insCover": {
    "defaultType": "bar",
    "labels": [
      "Maharashtra & Goa",
      "Tamil Nadu",
      "Karnataka",
      "UP East",
      "UP West",
      "Andhra Pradesh",
      "Delhi NCR",
      "Kolkata",
      "Bihar",
      "Assam"
    ],
    "datasets": [
      {
        "label": "Completed",
        "data": [
          96,
          91,
          88,
          84,
          80,
          77,
          74,
          70,
          66,
          62
        ],
        "barColor": "#108C72"
      },
      {
        "label": "Not yet done",
        "data": [
          4,
          9,
          12,
          16,
          20,
          23,
          26,
          30,
          34,
          38
        ],
        "barColor": "#E7848E"
      }
    ],
    "stacked": true,
    "horizontal": false
  },
  "chkOverall": {
    "defaultType": "donut",
    "labels": [
      "Yes",
      "No",
      "NA"
    ],
    "datasets": [
      {
        "label": "Answers",
        "data": [
          18420,
          1730,
          1204
        ],
        "pieColors": [
          "#108C72",
          "#EE2737",
          "#6B9BCC"
        ],
        "barColor": "#108C72"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "chkQuestions": {
    "defaultType": "bar",
    "labels": [
      "Safety signages displayed",
      "Incident reports documented",
      "Protocol for reporting incidents",
      "Drills conducted",
      "Reports reviewed for improvement",
      "Team for investigation"
    ],
    "datasets": [
      {
        "label": "Yes",
        "data": [
          91,
          88,
          93,
          84,
          86,
          90
        ],
        "barColor": "#108C72"
      },
      {
        "label": "No",
        "data": [
          6,
          9,
          5,
          13,
          11,
          7
        ],
        "barColor": "#EE2737"
      },
      {
        "label": "NA",
        "data": [
          3,
          3,
          2,
          3,
          3,
          3
        ],
        "barColor": "#6B9BCC"
      }
    ],
    "stacked": true,
    "horizontal": true
  },
  "chkCircle": {
    "defaultType": "bar",
    "labels": [
      "Maharashtra & Goa",
      "Tamil Nadu",
      "Karnataka",
      "UP East",
      "UP West",
      "Andhra Pradesh",
      "Delhi NCR",
      "Kolkata",
      "Bihar",
      "Assam"
    ],
    "datasets": [
      {
        "label": "No answers",
        "data": [
          142,
          131,
          124,
          118,
          109,
          101,
          96,
          88,
          82,
          75
        ],
        "barColor": "#EE2737"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "chkTrend": {
    "defaultType": "line",
    "labels": [
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct"
    ],
    "datasets": [
      {
        "label": "Compliance %",
        "data": [
          89.2,
          89.8,
          90.1,
          90.4,
          90.2,
          90.9,
          91.1,
          91,
          91.3,
          91.2,
          91.5,
          91.4
        ],
        "lineColor": "#108C72",
        "lineFill": "rgba(16,140,114,.10)",
        "barColor": "#108C72"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "actStatus": {
    "defaultType": "bar",
    "labels": [
      "Corrective",
      "Preventive"
    ],
    "datasets": [
      {
        "label": "Pending By Action Owner",
        "data": [
          258,
          206
        ],
        "barColor": "#EDC488"
      },
      {
        "label": "Closed By Action Owner",
        "data": [
          802,
          640
        ],
        "barColor": "#6B9BCC"
      }
    ],
    "stacked": true,
    "horizontal": false
  },
  "actAging": {
    "defaultType": "bar",
    "labels": [
      "0–3 days",
      "4–7 days",
      "8–14 days",
      "15–30 days",
      "30+ days"
    ],
    "datasets": [
      {
        "label": "Inspections",
        "data": [
          41,
          30,
          24,
          15,
          8
        ],
        "pieColors": [
          "#108C72",
          "#9EC8BA",
          "#EDC488",
          "#DA7756",
          "#EE2737"
        ],
        "barColor": "#DA7756"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "actOverdue": {
    "defaultType": "bar",
    "labels": [
      "Maharashtra & Goa",
      "Tamil Nadu",
      "Karnataka",
      "UP East",
      "UP West",
      "Andhra Pradesh",
      "Delhi NCR",
      "Kolkata",
      "Bihar",
      "Assam"
    ],
    "datasets": [
      {
        "label": "Past target date",
        "data": [
          8,
          7,
          7,
          6,
          5,
          5,
          4,
          4,
          3,
          3
        ],
        "barColor": "#EE2737"
      }
    ],
    "stacked": false,
    "horizontal": false
  },
  "actExt": {
    "defaultType": "line",
    "labels": [
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct"
    ],
    "datasets": [
      {
        "label": "Extensions",
        "data": [
          2,
          2,
          3,
          3,
          3,
          4,
          4,
          3,
          3,
          4,
          3,
          3
        ],
        "lineColor": "#6B9BCC",
        "lineFill": "rgba(107,155,204,.14)",
        "barColor": "#6B9BCC"
      }
    ],
    "stacked": false,
    "horizontal": false
  }
};
export const MY_CHARTS = [["insStatus","Inspection Status"],["insStage","Open Inspection Stage"],["insType","Inspections by Type"],["insTrend","Inspections Submitted vs Closed"],["insCircle","Inspections per Circle"],["insFacility","Inspections by Type of Facility"],["insFunc","Inspections by Function"],["insCover","Scheduled vs Completed by Circle"],["chkOverall","Checklist Answers"],["chkQuestions","Compliance by Checklist Question"],["chkCircle","Non-compliant Answers by Circle"],["chkTrend","Checklist Compliance Trend"],["actStatus","Corrective vs Preventive Status"],["actAging","Waiting for SPOC Action Plan — Aging"],["actOverdue","Plans Past Target Date by Circle"],["actExt","Target-date Extensions"]] as const;
export const GENERATED_ROWS = [{"html":"<td><b>2378</b></td><td>Lobby Inspection</td><td>Maharashtra & Goa</td><td>Birla Centurion Pvt. Ltd.</td><td>Sohail Ansari</td><td>01/01/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Draft</span></td>","status":"Draft","flags":[],"query":"2378 Lobby Inspection Maharashtra & Goa Birla Centurion Pvt. Ltd. Sohail Ansari","detail":{"crumb":"Inspection Directory › 2378","title":"Inspection 2378 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Draft</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Maharashtra & Goa</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Birla Centurion Pvt. Ltd.</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">01/01/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Draft inspection · not yet submitted.</div>"}},{"html":"<td><b>2391</b></td><td>Office Room</td><td>UP East</td><td>Birla Centurion Pvt. Ltd.</td><td>Neha Kapoor</td><td>04/02/2026</td><td style=\"text-align:center\">3</td><td style=\"text-align:center\">0 / 3</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["spoc"],"query":"2391 Office Room UP East Birla Centurion Pvt. Ltd. Neha Kapoor","detail":{"crumb":"Inspection Directory › 2391","title":"Inspection 2391 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP East</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Birla Centurion Pvt. Ltd.</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales & Distribution</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">04/02/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2404</b></td><td>Meeting Room Inspection</td><td>Delhi NCR</td><td>Birla Centurion Pvt. Ltd.</td><td>Rahul Verma</td><td>07/03/2026</td><td style=\"text-align:center\">1</td><td style=\"text-align:center\">1 / 1</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2404 Meeting Room Inspection Delhi NCR Birla Centurion Pvt. Ltd. Rahul Verma","detail":{"crumb":"Inspection Directory › 2404","title":"Inspection 2404 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Delhi NCR</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Birla Centurion Pvt. Ltd.</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Technology</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">07/03/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2417</b></td><td>Lobby Inspection</td><td>Assam</td><td>Site Pune</td><td>Priya Nair</td><td>10/04/2026</td><td style=\"text-align:center\">4</td><td style=\"text-align:center\">2 / 4</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2417 Lobby Inspection Assam Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2417","title":"Inspection 2417 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Assam</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Postpaid</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">10/04/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>No</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2430</b></td><td>Office Room</td><td>Karnataka</td><td>Site Nashik</td><td>Imran Sheikh</td><td>13/05/2026</td><td style=\"text-align:center\">2</td><td style=\"text-align:center\">0 / 2</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["spoc"],"query":"2430 Office Room Karnataka Site Nashik Imran Sheikh","detail":{"crumb":"Inspection Directory › 2430","title":"Inspection 2430 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Karnataka</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nashik</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nashik</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Customer Service</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Imran Sheikh</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">13/05/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2443</b></td><td>Meeting Room Inspection</td><td>Andhra Pradesh</td><td>Site Nagpur</td><td>Anita Desai</td><td>16/06/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2443 Meeting Room Inspection Andhra Pradesh Site Nagpur Anita Desai","detail":{"crumb":"Inspection Directory › 2443","title":"Inspection 2443 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Andhra Pradesh</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nagpur</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nagpur</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Finance</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Anita Desai</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">16/06/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>Yes</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2456</b></td><td>Lobby Inspection</td><td>Bihar</td><td>Site Worli</td><td>Sohail Ansari</td><td>19/07/2026</td><td style=\"text-align:center\">3</td><td style=\"text-align:center\">3 / 3</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2456 Lobby Inspection Bihar Site Worli Sohail Ansari","detail":{"crumb":"Inspection Directory › 2456","title":"Inspection 2456 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Bihar</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Worli</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">HR</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">19/07/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2469</b></td><td>Office Room</td><td>Tamil Nadu</td><td>Site Andheri</td><td>Neha Kapoor</td><td>22/08/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Draft</span></td>","status":"Draft","flags":[],"query":"2469 Office Room Tamil Nadu Site Andheri Neha Kapoor","detail":{"crumb":"Inspection Directory › 2469","title":"Inspection 2469 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Draft</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Tamil Nadu</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Andheri</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">22/08/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Draft inspection · not yet submitted.</div>"}},{"html":"<td><b>2482</b></td><td>Meeting Room Inspection</td><td>UP West</td><td>Site Thane</td><td>Rahul Verma</td><td>25/09/2026</td><td style=\"text-align:center\">4</td><td style=\"text-align:center\">4 / 4</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2482 Meeting Room Inspection UP West Site Thane Rahul Verma","detail":{"crumb":"Inspection Directory › 2482","title":"Inspection 2482 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP West</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Thane</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales & Distribution</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">25/09/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>No</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2495</b></td><td>Lobby Inspection</td><td>Kolkata</td><td>Site Pune</td><td>Priya Nair</td><td>28/10/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Scheduled</span></td>","status":"Scheduled","flags":[],"query":"2495 Lobby Inspection Kolkata Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2495","title":"Inspection 2495 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Scheduled</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Kolkata</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Technology</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">28/10/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Scheduled inspection · not yet started.</div>"}},{"html":"<td><b>2508</b></td><td>Office Room</td><td>Maharashtra & Goa</td><td>Site Nashik</td><td>Imran Sheikh</td><td>03/01/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["spoc"],"query":"2508 Office Room Maharashtra & Goa Site Nashik Imran Sheikh","detail":{"crumb":"Inspection Directory › 2508","title":"Inspection 2508 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Maharashtra & Goa</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nashik</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nashik</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Postpaid</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Imran Sheikh</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">03/01/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>Yes</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2521</b></td><td>Meeting Room Inspection</td><td>UP East</td><td>Site Nagpur</td><td>Anita Desai</td><td>06/02/2026</td><td style=\"text-align:center\">3</td><td style=\"text-align:center\">1 / 3</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2521 Meeting Room Inspection UP East Site Nagpur Anita Desai","detail":{"crumb":"Inspection Directory › 2521","title":"Inspection 2521 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP East</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nagpur</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nagpur</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Customer Service</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Anita Desai</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">06/02/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2534</b></td><td>Lobby Inspection</td><td>Delhi NCR</td><td>Site Worli</td><td>Sohail Ansari</td><td>09/03/2026</td><td style=\"text-align:center\">1</td><td style=\"text-align:center\">1 / 1</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2534 Lobby Inspection Delhi NCR Site Worli Sohail Ansari","detail":{"crumb":"Inspection Directory › 2534","title":"Inspection 2534 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Delhi NCR</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Worli</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Finance</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">09/03/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2547</b></td><td>Office Room</td><td>Assam</td><td>Site Andheri</td><td>Neha Kapoor</td><td>12/04/2026</td><td style=\"text-align:center\">4</td><td style=\"text-align:center\">4 / 4</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2547 Office Room Assam Site Andheri Neha Kapoor","detail":{"crumb":"Inspection Directory › 2547","title":"Inspection 2547 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Assam</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Andheri</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">HR</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">12/04/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>No</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2560</b></td><td>Meeting Room Inspection</td><td>Karnataka</td><td>Site Thane</td><td>Rahul Verma</td><td>15/05/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Draft</span></td>","status":"Draft","flags":[],"query":"2560 Meeting Room Inspection Karnataka Site Thane Rahul Verma","detail":{"crumb":"Inspection Directory › 2560","title":"Inspection 2560 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Draft</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Karnataka</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Thane</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">15/05/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Draft inspection · not yet submitted.</div>"}},{"html":"<td><b>2573</b></td><td>Lobby Inspection</td><td>Andhra Pradesh</td><td>Site Pune</td><td>Priya Nair</td><td>18/06/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2573 Lobby Inspection Andhra Pradesh Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2573","title":"Inspection 2573 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Andhra Pradesh</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales & Distribution</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">18/06/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>Yes</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2586</b></td><td>Office Room</td><td>Bihar</td><td>Site Nashik</td><td>Imran Sheikh</td><td>21/07/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Scheduled</span></td>","status":"Scheduled","flags":[],"query":"2586 Office Room Bihar Site Nashik Imran Sheikh","detail":{"crumb":"Inspection Directory › 2586","title":"Inspection 2586 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Scheduled</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Bihar</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nashik</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nashik</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Technology</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Imran Sheikh</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">21/07/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Scheduled inspection · not yet started.</div>"}},{"html":"<td><b>2599</b></td><td>Meeting Room Inspection</td><td>Tamil Nadu</td><td>Site Nagpur</td><td>Anita Desai</td><td>24/08/2026</td><td style=\"text-align:center\">1</td><td style=\"text-align:center\">0 / 1</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2599 Meeting Room Inspection Tamil Nadu Site Nagpur Anita Desai","detail":{"crumb":"Inspection Directory › 2599","title":"Inspection 2599 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Tamil Nadu</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nagpur</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nagpur</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Postpaid</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Anita Desai</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">24/08/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2612</b></td><td>Lobby Inspection</td><td>UP West</td><td>Site Worli</td><td>Sohail Ansari</td><td>27/09/2026</td><td style=\"text-align:center\">4</td><td style=\"text-align:center\">2 / 4</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2612 Lobby Inspection UP West Site Worli Sohail Ansari","detail":{"crumb":"Inspection Directory › 2612","title":"Inspection 2612 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP West</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Worli</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Customer Service</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">27/09/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>No</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2625</b></td><td>Office Room</td><td>Kolkata</td><td>Site Andheri</td><td>Neha Kapoor</td><td>02/10/2026</td><td style=\"text-align:center\">2</td><td style=\"text-align:center\">2 / 2</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2625 Office Room Kolkata Site Andheri Neha Kapoor","detail":{"crumb":"Inspection Directory › 2625","title":"Inspection 2625 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Kolkata</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Andheri</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Finance</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">02/10/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2638</b></td><td>Meeting Room Inspection</td><td>Maharashtra & Goa</td><td>Site Thane</td><td>Rahul Verma</td><td>05/01/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2638 Meeting Room Inspection Maharashtra & Goa Site Thane Rahul Verma","detail":{"crumb":"Inspection Directory › 2638","title":"Inspection 2638 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Maharashtra & Goa</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Thane</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">HR</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">05/01/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>Yes</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2651</b></td><td>Lobby Inspection</td><td>UP East</td><td>Site Pune</td><td>Priya Nair</td><td>08/02/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Draft</span></td>","status":"Draft","flags":[],"query":"2651 Lobby Inspection UP East Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2651","title":"Inspection 2651 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Draft</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP East</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">08/02/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Draft inspection · not yet submitted.</div>"}},{"html":"<td><b>2664</b></td><td>Office Room</td><td>Delhi NCR</td><td>Site Nashik</td><td>Imran Sheikh</td><td>11/03/2026</td><td style=\"text-align:center\">1</td><td style=\"text-align:center\">1 / 1</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2664 Office Room Delhi NCR Site Nashik Imran Sheikh","detail":{"crumb":"Inspection Directory › 2664","title":"Inspection 2664 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Delhi NCR</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nashik</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nashik</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales & Distribution</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Imran Sheikh</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">11/03/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2677</b></td><td>Meeting Room Inspection</td><td>Assam</td><td>Site Nagpur</td><td>Anita Desai</td><td>14/04/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Scheduled</span></td>","status":"Scheduled","flags":[],"query":"2677 Meeting Room Inspection Assam Site Nagpur Anita Desai","detail":{"crumb":"Inspection Directory › 2677","title":"Inspection 2677 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Scheduled</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Assam</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nagpur</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nagpur</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Technology</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Anita Desai</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">14/04/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Scheduled inspection · not yet started.</div>"}},{"html":"<td><b>2690</b></td><td>Lobby Inspection</td><td>Karnataka</td><td>Site Worli</td><td>Sohail Ansari</td><td>17/05/2026</td><td style=\"text-align:center\">2</td><td style=\"text-align:center\">1 / 2</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2690 Lobby Inspection Karnataka Site Worli Sohail Ansari","detail":{"crumb":"Inspection Directory › 2690","title":"Inspection 2690 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Karnataka</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Worli</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Postpaid</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">17/05/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2703</b></td><td>Office Room</td><td>Andhra Pradesh</td><td>Site Andheri</td><td>Neha Kapoor</td><td>20/06/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["spoc"],"query":"2703 Office Room Andhra Pradesh Site Andheri Neha Kapoor","detail":{"crumb":"Inspection Directory › 2703","title":"Inspection 2703 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Andhra Pradesh</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Andheri</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Customer Service</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">20/06/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>Yes</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2716</b></td><td>Meeting Room Inspection</td><td>Bihar</td><td>Site Thane</td><td>Rahul Verma</td><td>23/07/2026</td><td style=\"text-align:center\">3</td><td style=\"text-align:center\">3 / 3</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2716 Meeting Room Inspection Bihar Site Thane Rahul Verma","detail":{"crumb":"Inspection Directory › 2716","title":"Inspection 2716 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Bihar</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Thane</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Finance</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">23/07/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2729</b></td><td>Lobby Inspection</td><td>Tamil Nadu</td><td>Site Pune</td><td>Priya Nair</td><td>26/08/2026</td><td style=\"text-align:center\">1</td><td style=\"text-align:center\">1 / 1</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2729 Lobby Inspection Tamil Nadu Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2729","title":"Inspection 2729 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Tamil Nadu</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">HR</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">26/08/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2742</b></td><td>Office Room</td><td>UP West</td><td>Site Nashik</td><td>Imran Sheikh</td><td>01/09/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Draft</span></td>","status":"Draft","flags":[],"query":"2742 Office Room UP West Site Nashik Imran Sheikh","detail":{"crumb":"Inspection Directory › 2742","title":"Inspection 2742 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Draft</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP West</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nashik</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nashik</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Imran Sheikh</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">01/09/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Draft inspection · not yet submitted.</div>"}},{"html":"<td><b>2755</b></td><td>Meeting Room Inspection</td><td>Kolkata</td><td>Site Nagpur</td><td>Anita Desai</td><td>04/10/2026</td><td style=\"text-align:center\">2</td><td style=\"text-align:center\">2 / 2</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2755 Meeting Room Inspection Kolkata Site Nagpur Anita Desai","detail":{"crumb":"Inspection Directory › 2755","title":"Inspection 2755 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Kolkata</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nagpur</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nagpur</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales & Distribution</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Anita Desai</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">04/10/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2768</b></td><td>Lobby Inspection</td><td>Maharashtra & Goa</td><td>Site Worli</td><td>Sohail Ansari</td><td>07/01/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Scheduled</span></td>","status":"Scheduled","flags":[],"query":"2768 Lobby Inspection Maharashtra & Goa Site Worli Sohail Ansari","detail":{"crumb":"Inspection Directory › 2768","title":"Inspection 2768 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Scheduled</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Maharashtra & Goa</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Worli</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Technology</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">07/01/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Scheduled inspection · not yet started.</div>"}},{"html":"<td><b>2781</b></td><td>Office Room</td><td>UP East</td><td>Site Andheri</td><td>Neha Kapoor</td><td>10/02/2026</td><td style=\"text-align:center\">3</td><td style=\"text-align:center\">0 / 3</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["spoc"],"query":"2781 Office Room UP East Site Andheri Neha Kapoor","detail":{"crumb":"Inspection Directory › 2781","title":"Inspection 2781 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP East</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Andheri</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Postpaid</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">10/02/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2794</b></td><td>Meeting Room Inspection</td><td>Delhi NCR</td><td>Site Thane</td><td>Rahul Verma</td><td>13/03/2026</td><td style=\"text-align:center\">1</td><td style=\"text-align:center\">0 / 1</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2794 Meeting Room Inspection Delhi NCR Site Thane Rahul Verma","detail":{"crumb":"Inspection Directory › 2794","title":"Inspection 2794 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Delhi NCR</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Thane</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Customer Service</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">13/03/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>Yes</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2807</b></td><td>Lobby Inspection</td><td>Assam</td><td>Site Pune</td><td>Priya Nair</td><td>16/04/2026</td><td style=\"text-align:center\">4</td><td style=\"text-align:center\">4 / 4</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2807 Lobby Inspection Assam Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2807","title":"Inspection 2807 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Assam</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Finance</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">16/04/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>No</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2820</b></td><td>Office Room</td><td>Karnataka</td><td>Site Nashik</td><td>Imran Sheikh</td><td>19/05/2026</td><td style=\"text-align:center\">2</td><td style=\"text-align:center\">2 / 2</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2820 Office Room Karnataka Site Nashik Imran Sheikh","detail":{"crumb":"Inspection Directory › 2820","title":"Inspection 2820 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Karnataka</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nashik</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nashik</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">HR</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Imran Sheikh</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">19/05/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2833</b></td><td>Meeting Room Inspection</td><td>Andhra Pradesh</td><td>Site Nagpur</td><td>Anita Desai</td><td>22/06/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Draft</span></td>","status":"Draft","flags":[],"query":"2833 Meeting Room Inspection Andhra Pradesh Site Nagpur Anita Desai","detail":{"crumb":"Inspection Directory › 2833","title":"Inspection 2833 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Draft</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Andhra Pradesh</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Nagpur</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Nagpur</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Anita Desai</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">22/06/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Draft inspection · not yet submitted.</div>"}},{"html":"<td><b>2846</b></td><td>Lobby Inspection</td><td>Bihar</td><td>Site Worli</td><td>Sohail Ansari</td><td>25/07/2026</td><td style=\"text-align:center\">3</td><td style=\"text-align:center\">3 / 3</td><td><span class=\"badge b-info\">Closed</span></td>","status":"Closed","flags":[],"query":"2846 Lobby Inspection Bihar Site Worli Sohail Ansari","detail":{"crumb":"Inspection Directory › 2846","title":"Inspection 2846 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">3</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Closed</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Bihar</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Worli</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Worli</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Sales & Distribution</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Sohail Ansari</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">25/07/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2859</b></td><td>Office Room</td><td>Tamil Nadu</td><td>Site Andheri</td><td>Neha Kapoor</td><td>28/08/2026</td><td style=\"text-align:center\">0</td><td style=\"text-align:center\">0 / 0</td><td><span class=\"badge b-warn\">Scheduled</span></td>","status":"Scheduled","flags":[],"query":"2859 Office Room Tamil Nadu Site Andheri Neha Kapoor","detail":{"crumb":"Inspection Directory › 2859","title":"Inspection 2859 · Office Room","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">0</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Scheduled</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Office Room</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Tamil Nadu</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Andheri</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Andheri</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Technology</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Neha Kapoor</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">28/08/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><div class=\"dr-note\">Scheduled inspection · not yet started.</div>"}},{"html":"<td><b>2872</b></td><td>Meeting Room Inspection</td><td>UP West</td><td>Site Thane</td><td>Rahul Verma</td><td>03/09/2026</td><td style=\"text-align:center\">4</td><td style=\"text-align:center\">2 / 4</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2872 Meeting Room Inspection UP West Site Thane Rahul Verma","detail":{"crumb":"Inspection Directory › 2872","title":"Inspection 2872 · Meeting Room Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">4</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Meeting Room Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">UP West</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Thane</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Thane</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Postpaid</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Rahul Verma</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">03/09/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>No</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>No</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}},{"html":"<td><b>2885</b></td><td>Lobby Inspection</td><td>Kolkata</td><td>Site Pune</td><td>Priya Nair</td><td>06/10/2026</td><td style=\"text-align:center\">2</td><td style=\"text-align:center\">1 / 2</td><td><span class=\"badge b-err\">Open</span></td>","status":"Open","flags":["ao"],"query":"2885 Lobby Inspection Kolkata Site Pune Priya Nair","detail":{"crumb":"Inspection Directory › 2885","title":"Inspection 2885 · Lobby Inspection","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">2</div><div class=\"l\">Findings (No answers)</div></div><div class=\"dr-stat\"><div class=\"v\">1</div><div class=\"l\">Actions closed</div></div><div class=\"dr-stat\"><div class=\"v\">Open</div><div class=\"l\">Status</div></div></div><h4>Inspection details</h4><table class=\"dr-tbl\"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td class=\"strong\">Type</td><td class=\"\">Lobby Inspection</td></tr><tr><td class=\"strong\">Circle</td><td class=\"\">Kolkata</td></tr><tr><td class=\"strong\">Work Location</td><td class=\"\">Pune</td></tr><tr><td class=\"strong\">Inspection Location</td><td class=\"\">Site Pune</td></tr><tr><td class=\"strong\">Function</td><td class=\"\">Customer Service</td></tr><tr><td class=\"strong\">Inspector</td><td class=\"\">Priya Nair</td></tr><tr><td class=\"strong\">Date of Inspection</td><td class=\"\">06/10/2026</td></tr><tr><td class=\"strong\">SPOC</td><td class=\"\">Shahab Mirza</td></tr><tr><td class=\"strong\">Functional Head</td><td class=\"\">Kshitij Rasal</td></tr></tbody></table><h4>Checklist</h4><table class=\"dr-tbl\"><thead><tr><th>#</th><th>Question</th><th>Answer</th></tr></thead><tbody><tr><td>1</td><td>Are safety signages clearly displayed and vi…</td><td>No</td></tr><tr><td>2</td><td>Are incident reports documented and analyzed…</td><td>No</td></tr><tr><td>3</td><td>Is there a protocol for reporting incidents?…</td><td>Yes</td></tr><tr><td>4</td><td>How often are drills conducted for response?…</td><td>Yes</td></tr><tr><td>5</td><td>Are incident reports reviewed for improvemen…</td><td>Yes</td></tr><tr><td>6</td><td>Is there a designated team for incident inve…</td><td>Yes</td></tr></tbody></table>"}}] as const;
export const GENERATED_DRILLS = {"ins-total":{"crumb":"Overview › Inspections","title":"Total Inspections · 1,860","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">1860</div><div class=\"l\">Total</div></div><div class=\"dr-stat\"><div class=\"v\">143</div><div class=\"l\">Draft</div></div><div class=\"dr-stat\"><div class=\"v\">120</div><div class=\"l\">Scheduled</div></div><div class=\"dr-stat\"><div class=\"v\">482</div><div class=\"l\">Open</div></div><div class=\"dr-stat\"><div class=\"v\">1115</div><div class=\"l\">Closed</div></div></div><h4>By Circle</h4><table class=\"dr-tbl\"><thead><tr><th>Circle</th><th>Open</th><th>Closed</th></tr></thead><tbody><tr><td class=\"strong\">Maharashtra & Goa</td><td class=\"num\">38</td><td class=\"num\">88</td></tr><tr><td class=\"strong\">Tamil Nadu</td><td class=\"num\">35</td><td class=\"num\">81</td></tr><tr><td class=\"strong\">Karnataka</td><td class=\"num\">32</td><td class=\"num\">74</td></tr><tr><td class=\"strong\">UP East</td><td class=\"num\">29</td><td class=\"num\">67</td></tr><tr><td class=\"strong\">UP West</td><td class=\"num\">26</td><td class=\"num\">60</td></tr><tr><td class=\"strong\">Andhra Pradesh</td><td class=\"num\">23</td><td class=\"num\">53</td></tr></tbody></table>"},"ins-draft":{"crumb":"Overview › Inspections","title":"Draft Inspections · 143","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">143</div><div class=\"l\">Drafts</div></div><div class=\"dr-stat\"><div class=\"v\">27</div><div class=\"l\">Older than 7 days</div></div></div><div class=\"dr-note\">Drafts are saved by the Inspector with Save draft.</div>"},"ins-sched":{"crumb":"Overview › Inspections","title":"Scheduled Inspections · 120","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">120</div><div class=\"l\">Scheduled</div></div><div class=\"dr-stat\"><div class=\"v\">36</div><div class=\"l\">Past scheduled date</div></div></div><div class=\"dr-note\">How scheduling works is not shown in the design.</div>"},"ins-open":{"crumb":"Overview › Inspections","title":"Open Inspections · 482","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">118</div><div class=\"l\">Pending SPOC</div></div><div class=\"dr-stat\"><div class=\"v\">364</div><div class=\"l\">Pending Action Owner</div></div></div><h4>Oldest open</h4><table class=\"dr-tbl\"><thead><tr><th>Inspection</th><th>Circle</th><th>Days open</th></tr></thead><tbody><tr><td class=\"strong\">2391</td><td class=\"\">Tamil Nadu</td><td class=\"num\">44</td></tr><tr><td class=\"strong\">2417</td><td class=\"\">Karnataka</td><td class=\"num\">38</td></tr><tr><td class=\"strong\">2443</td><td class=\"\">UP East</td><td class=\"num\">31</td></tr></tbody></table>"},"ins-closed":{"crumb":"Overview › Inspections","title":"Closed Inspections · 1,115","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">1115</div><div class=\"l\">Closed</div></div><div class=\"dr-stat\"><div class=\"v\">59.9%</div><div class=\"l\">Of all inspections</div></div></div><div class=\"dr-note\">Closing shows “Inspection Closed” with a Download Report option.</div>"},"ins-spoc":{"crumb":"Overview › Action Plans","title":"Pending by SPOC · 118","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">118</div><div class=\"l\">Pending</div></div><div class=\"dr-stat\"><div class=\"v\">47</div><div class=\"l\">Waiting > 7 days</div></div></div><h4>By SPOC</h4><table class=\"dr-tbl\"><thead><tr><th>SPOC</th><th>Pending</th></tr></thead><tbody><tr><td class=\"strong\">Shahab Mirza</td><td class=\"num\">24</td></tr><tr><td class=\"strong\">Meera Iyer</td><td class=\"num\">21</td></tr><tr><td class=\"strong\">Kunal Shah</td><td class=\"num\">18</td></tr><tr><td class=\"strong\">Deepa Rao</td><td class=\"num\">14</td></tr></tbody></table>"},"ins-ao":{"crumb":"Overview › Action Plans","title":"Pending by Action Owner · 364","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">364</div><div class=\"l\">Pending</div></div><div class=\"dr-stat\"><div class=\"v\">73</div><div class=\"l\">Past target date</div></div></div><h4>Next due</h4><table class=\"dr-tbl\"><thead><tr><th>Plan</th><th>Inspection</th><th>Action Owner</th><th>Target</th></tr></thead><tbody><tr><td class=\"strong\">Ca01</td><td class=\"num\">2378</td><td class=\"\">Vama Shah</td><td class=\"\">18 Sep</td></tr><tr><td class=\"strong\">Pa01</td><td class=\"num\">2391</td><td class=\"\">Rohit Patil</td><td class=\"\">19 Sep</td></tr></tbody></table>"},"ins-cbs":{"crumb":"Overview › Action Plans","title":"Closed by SPOC · 230","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">230</div><div class=\"l\">Closed by SPOC</div></div><div class=\"dr-stat\"><div class=\"v\">20.6%</div><div class=\"l\">Of closed</div></div></div><div class=\"dr-note\">Assumed to be inspections closed without an action plan. Needs confirmation.</div>"},"ins-comp":{"crumb":"Overview › Checklist","title":"Checklist Compliance · 91.4%","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">91.4%</div><div class=\"l\">Compliance</div></div><div class=\"dr-stat\"><div class=\"v\">1730</div><div class=\"l\">No answers</div></div><div class=\"dr-stat\"><div class=\"v\">1204</div><div class=\"l\">NA answers</div></div></div><h4>Lowest questions</h4><table class=\"dr-tbl\"><thead><tr><th>Question</th><th>Yes %</th></tr></thead><tbody><tr><td class=\"strong\">Drills conducted</td><td class=\"num\">84</td></tr><tr><td class=\"strong\">Reports reviewed for improvement</td><td class=\"num\">86</td></tr><tr><td class=\"strong\">Incident reports documented</td><td class=\"num\">88</td></tr></tbody></table>"},"alert-spoc":{"crumb":"Priority Actions","title":"Inspections awaiting SPOC action plan > 7 days · 47","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">24</div><div class=\"l\">8–14 days</div></div><div class=\"dr-stat\"><div class=\"v\">15</div><div class=\"l\">15–30 days</div></div><div class=\"dr-stat\"><div class=\"v\">8</div><div class=\"l\">30+ days</div></div></div><div class=\"dr-note\">Proposed measure · days counted from submission.</div>"},"alert-overdue":{"crumb":"Priority Actions","title":"Action plans past target date · 73","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">73</div><div class=\"l\">Past target</div></div><div class=\"dr-stat\"><div class=\"v\">41</div><div class=\"l\">Extended</div></div></div><h4>By Action Owner</h4><table class=\"dr-tbl\"><thead><tr><th>Action Owner</th><th>Open</th><th>Past target</th></tr></thead><tbody><tr><td class=\"strong\">Vama Shah</td><td class=\"num\">58</td><td class=\"num\">14</td></tr><tr><td class=\"strong\">Rohit Patil</td><td class=\"num\">51</td><td class=\"num\">12</td></tr><tr><td class=\"strong\">Sneha Kulkarni</td><td class=\"num\">44</td><td class=\"num\">10</td></tr></tbody></table>"},"alert-ext":{"crumb":"Priority Actions","title":"Target-date extensions · 41","html":"<div class=\"dr-stats\"><div class=\"dr-stat\"><div class=\"v\">41</div><div class=\"l\">Extensions</div></div><div class=\"dr-stat\"><div class=\"v\">23</div><div class=\"l\">Corrective</div></div><div class=\"dr-stat\"><div class=\"v\">18</div><div class=\"l\">Preventive</div></div></div><div class=\"dr-note\">Counts plans with an Extend Target Date.</div>"},"alert-sched":{"crumb":"Priority Actions","title":"Scheduled inspections past their date · 36","html":"<div class=\"dr-stats two\"><div class=\"dr-stat\"><div class=\"v\">36</div><div class=\"l\">Not started</div></div><div class=\"dr-stat\"><div class=\"v\">120</div><div class=\"l\">All scheduled</div></div></div><div class=\"dr-note\">Proposed measure.</div>"},"circle-underperform":{"crumb":"Overview › Circle follow-up","title":"Circles needing follow-up","html":"<div class=\"dr-note\">Lowest average closure progress across the five stages.</div><table class=\"dr-tbl\"><thead><tr><th>Circle</th><th>Open</th><th>Pending SPOC</th><th>Pending AO</th></tr></thead><tbody><tr><td class=\"strong\">Bihar</td><td class=\"num\">16</td><td class=\"num\">10</td><td class=\"num\">28</td></tr><tr><td class=\"strong\">Assam</td><td class=\"num\">14</td><td class=\"num\">9</td><td class=\"num\">25</td></tr><tr><td class=\"strong\">NESA</td><td class=\"num\">12</td><td class=\"num\">7</td><td class=\"num\">22</td></tr><tr><td class=\"strong\">Kolkata</td><td class=\"num\">15</td><td class=\"num\">8</td><td class=\"num\">21</td></tr></tbody></table>"},"_default":{"crumb":"Inspection","title":"Details","html":"<div class=\"dr-note\">Detail view for this item.</div>"}};
export const HEATMAP_STAGES = ["Closed","Plan Created","Action Taken","On-time","Checklist Pass"] as const;
export const HEATMAP = [
  { "circle": "Maharashtra & Goa", "cells": [{ "cls": "c4", "value": "94%" },{ "cls": "c3", "value": "83%" },{ "cls": "c2", "value": "72%" },{ "cls": "c1", "value": "61%" },{ "cls": "c3", "value": "88%" }] },
  { "circle": "Tamil Nadu", "cells": [{ "cls": "c3", "value": "87%" },{ "cls": "c2", "value": "76%" },{ "cls": "c1", "value": "65%" },{ "cls": "c4", "value": "92%" },{ "cls": "c3", "value": "81%" }] },
  { "circle": "Karnataka", "cells": [{ "cls": "c3", "value": "80%" },{ "cls": "c1", "value": "69%" },{ "cls": "c1", "value": "58%" },{ "cls": "c3", "value": "85%" },{ "cls": "c2", "value": "74%" }] },
  { "circle": "UP East", "cells": [{ "cls": "c2", "value": "73%" },{ "cls": "c1", "value": "62%" },{ "cls": "c3", "value": "89%" },{ "cls": "c2", "value": "78%" },{ "cls": "c1", "value": "67%" }] },
  { "circle": "UP West", "cells": [{ "cls": "c1", "value": "66%" },{ "cls": "c4", "value": "93%" },{ "cls": "c3", "value": "82%" },{ "cls": "c2", "value": "71%" },{ "cls": "c1", "value": "60%" }] },
  { "circle": "Andhra Pradesh", "cells": [{ "cls": "c1", "value": "59%" },{ "cls": "c3", "value": "86%" },{ "cls": "c2", "value": "75%" },{ "cls": "c1", "value": "64%" },{ "cls": "c4", "value": "91%" }] },
  { "circle": "Delhi NCR", "cells": [{ "cls": "c4", "value": "90%" },{ "cls": "c2", "value": "79%" },{ "cls": "c1", "value": "68%" },{ "cls": "c1", "value": "57%" },{ "cls": "c3", "value": "84%" }] },
  { "circle": "Kolkata", "cells": [{ "cls": "c3", "value": "83%" },{ "cls": "c2", "value": "72%" },{ "cls": "c1", "value": "61%" },{ "cls": "c3", "value": "88%" },{ "cls": "c2", "value": "77%" }] },
  { "circle": "Bihar", "cells": [{ "cls": "c2", "value": "76%" },{ "cls": "c1", "value": "65%" },{ "cls": "c4", "value": "92%" },{ "cls": "c3", "value": "81%" },{ "cls": "c2", "value": "70%" }] },
  { "circle": "Assam", "cells": [{ "cls": "c1", "value": "63%" },{ "cls": "c1", "value": "52%" },{ "cls": "c2", "value": "79%" },{ "cls": "c1", "value": "68%" },{ "cls": "c1", "value": "57%" }] },
  { "circle": "NESA", "cells": [{ "cls": "c1", "value": "56%" },{ "cls": "c3", "value": "83%" },{ "cls": "c2", "value": "72%" },{ "cls": "c1", "value": "61%" },{ "cls": "c3", "value": "88%" }] },
  { "circle": "Kerala", "cells": [{ "cls": "c3", "value": "87%" },{ "cls": "c2", "value": "76%" },{ "cls": "c1", "value": "65%" },{ "cls": "c1", "value": "54%" },{ "cls": "c3", "value": "81%" }] },
] as const;
export const FOLLOW_UP = [
  {
    "name": "Assam",
    "meta": "Average across the five stages",
    "value": "63.8%"
  },
  {
    "name": "NESA",
    "meta": "Average across the five stages",
    "value": "72.0%"
  },
  {
    "name": "Kerala",
    "meta": "Average across the five stages",
    "value": "72.6%"
  },
  {
    "name": "Karnataka",
    "meta": "Average across the five stages",
    "value": "73.2%"
  },
  {
    "name": "UP East",
    "meta": "Average across the five stages",
    "value": "73.8%"
  }
] as const;
export const SPOC_BOARD = [
  {
    "name": "Shahab Mirza",
    "meta": "Inspections without a plan",
    "value": "24"
  },
  {
    "name": "Meera Iyer",
    "meta": "Inspections without a plan",
    "value": "21"
  },
  {
    "name": "Kunal Shah",
    "meta": "Inspections without a plan",
    "value": "18"
  },
  {
    "name": "Deepa Rao",
    "meta": "Inspections without a plan",
    "value": "14"
  },
  {
    "name": "Farhan Ali",
    "meta": "Inspections without a plan",
    "value": "11"
  }
] as const;
export const OWNER_BOARD = [
  {
    "name": "Vama Shah",
    "meta": "Plans not yet closed",
    "value": "58"
  },
  {
    "name": "Rohit Patil",
    "meta": "Plans not yet closed",
    "value": "51"
  },
  {
    "name": "Sneha Kulkarni",
    "meta": "Plans not yet closed",
    "value": "44"
  },
  {
    "name": "Arjun Menon",
    "meta": "Plans not yet closed",
    "value": "38"
  },
  {
    "name": "Pooja Singh",
    "meta": "Plans not yet closed",
    "value": "31"
  }
] as const;
export const OVERDUE_PLANS = [["Ca01","2378","Vama Shah","18/09/2026","33"],["Pa01","2391","Rohit Patil","19/09/2026","32"],["Ca02","2404","Sneha Kulkarni","22/09/2026","29"],["Pa02","2417","Arjun Menon","24/09/2026","27"],["Ca01","2430","Pooja Singh","26/09/2026","25"],["Pa01","2446","Vama Shah","28/09/2026","23"]] as const;
export const OVERDUE_TAG = "73 overdue";
export const KPI_INFO = [
  {
    "id": "ins-total",
    "label": "Total Inspections",
    "group": "ins",
    "panel": "acc-ins",
    "section": "Inspections",
    "color": "var(--terra)",
    "tint": "rgba(218,119,86,.12)",
    "icon": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6",
    "info": "Every inspection record · Draft + Scheduled + Open + Closed."
  },
  {
    "id": "ins-draft",
    "label": "Draft Inspections",
    "group": "ins",
    "panel": "acc-ins",
    "section": "Inspections",
    "color": "var(--warn)",
    "tint": "rgba(237,196,136,.22)",
    "icon": "M12 20h9|M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
    "info": "Inspections the Inspector saved with Save draft and has not submitted."
  },
  {
    "id": "ins-sched",
    "label": "Scheduled Inspections",
    "group": "ins",
    "panel": "acc-ins",
    "section": "Inspections",
    "color": "var(--lav)",
    "tint": "rgba(206,203,246,.28)",
    "icon": "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z",
    "info": "Inspections with status Scheduled. How an inspection gets scheduled is not shown in the design."
  },
  {
    "id": "ins-open",
    "label": "Open Inspections",
    "group": "ins",
    "panel": "acc-ins",
    "section": "Inspections",
    "color": "var(--vi-red)",
    "tint": "rgba(238,39,55,.10)",
    "icon": "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z",
    "info": "Submitted inspections not yet closed · Pending by SPOC + Pending by Action Owner."
  },
  {
    "id": "ins-closed",
    "label": "Closed Inspections",
    "group": "ins",
    "panel": "acc-ins",
    "section": "Inspections",
    "color": "var(--blue)",
    "tint": "rgba(107,155,204,.16)",
    "icon": "M22 11.08V12a10 10 0 11-5.93-9.14|M22 4L12 14.01l-3-3",
    "info": "Inspections with status Closed. Closing returns an “Inspection Closed” message with Download Report."
  },
  {
    "id": "ins-spoc",
    "label": "Pending by SPOC",
    "group": "act",
    "panel": "acc-act",
    "section": "Action Plans",
    "color": "var(--err)",
    "tint": "rgba(231,132,142,.18)",
    "icon": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 11a4 4 0 100-8 4 4 0 000 8z",
    "info": "Open inspections where the SPOC has not yet submitted the action plan."
  },
  {
    "id": "ins-ao",
    "label": "Pending by Action Owner",
    "group": "act",
    "panel": "acc-act",
    "section": "Action Plans",
    "color": "var(--warn)",
    "tint": "rgba(237,196,136,.22)",
    "icon": "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z",
    "info": "Open inspections whose action plan is submitted and whose action taken is not yet recorded."
  },
  {
    "id": "ins-cbs",
    "label": "Closed by SPOC",
    "group": "act",
    "panel": "acc-act",
    "section": "Action Plans",
    "color": "var(--ok)",
    "tint": "rgba(16,140,114,.14)",
    "icon": "M9 12l2 2 4-4|M12 22a10 10 0 100-20 10 10 0 000 20z",
    "info": "Inspections closed by the SPOC. Shown on the Inspector and SPOC dashboards; assumed to mean closed without an action plan. Needs confirmation."
  },
  {
    "id": "ins-comp",
    "label": "Checklist Compliance",
    "group": "chk",
    "panel": "acc-chk",
    "section": "Checklist",
    "color": "var(--teal)",
    "tint": "rgba(158,200,186,.26)",
    "icon": "M5 12h14|M12 5l7 7-7 7",
    "info": "Yes answers ÷ (Yes + No answers) across submitted checklists; NA is excluded. Proposed measure."
  }
] as const;
export const CARD_INFO = {
  "Closure Progress by Circle × Stage": "% complete per stage per circle. Green ≥90%, Teal 80–90%, Amber 70–80%, Red <70%. On-time and Checklist Pass are proposed measures.",
  "Circles Needing Follow-up": "Circles ranked by the average of the five heatmap stages, lowest first.",
  "All Inspections — with findings and action plan progress at a glance": "Every inspection with its findings and action progress. Click a row for the full drill-down.",
  "Site Visit Verification": "Punch In and Punch Out are captured within 2 km of the site in the Figma location screens. Percentages are proposed measures.",
  "Checklist Compliance · 12 Months": "Yes ÷ (Yes + No) per month. NA is excluded. Proposed measure."
} as const;
export const DIR_CHIPS = [["all","All (1,860)"],["Draft","Draft (143)"],["Scheduled","Scheduled (120)"],["Open","Open (482)"],["Closed","Closed (1,115)"],["spoc","Pending SPOC (118)"],["ao","Pending Action Owner (364)"]] as const;
export const DIR_COLS = 9;
export const SCOPES = {
  "admin": {
    "title": "Inspection · Pan India View",
    "scope": "1,860 inspections across 22 circles · 91.4% checklist compliance",
    "role": "Pan India",
    "k": [
      1860,
      143,
      120,
      482,
      1115,
      118,
      364,
      230,
      "91.4%"
    ]
  },
  "circle": {
    "title": "Inspection · Maharashtra & Goa Circle",
    "scope": "146 inspections · 12 clusters · 84 work locations",
    "role": "Circle Manager",
    "k": [
      146,
      11,
      9,
      38,
      88,
      9,
      29,
      18,
      "92.1%"
    ]
  }
} as const;
