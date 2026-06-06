import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MomAttendee {
  id: number;
  name: string;
  email: string;
  organization: string;
  role: string;
  mom_attendee_user?: 
  {
    name: string;
    email: string 
  };
}

interface MomTask {
  id: number;
  description: string;
  responsible_person_name: string;
  target_date: string;
  status: string;
}

interface ResponsiblePerson {
  id: number;
  name: string;
  email: string;
}

export interface MomData {
  id: number;
  title: string;
  meeting_date: string;
  meeting_mode: string;
  meeting_type: string;
  responsible_person: ResponsiblePerson | null;
  mom_attendees: MomAttendee[];
  mom_tasks: MomTask[];
  // ── Future API fields (not available yet — using mock below) ──
  agenda_items?: AgendaItem[];
  discussion_summary?: DiscussionSection[];
  decisions?: string[];
  next_steps?: NextStepRow[];
}

// ─── Types for static sections ───────────────────────────────────────────────

interface AgendaItem {
  item: string;
  duration: string;
  led: string;
}

interface DiscussionPoint {
  text: string;
}

interface DiscussionSection {
  title: string;
  body?: string;           // paragraph text
  points?: DiscussionPoint[]; // bullet points
}

interface NextStepRow {
  date: string;
  activity: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// When backend adds API support, replace each key below with:
// const agenda     = data.agenda_items     ?? MOCK_DATA.agenda;
// const discussion = data.discussion_summary ?? MOCK_DATA.discussion;
// const decisions  = data.decisions        ?? MOCK_DATA.decisions;
// const nextSteps  = data.next_steps       ?? MOCK_DATA.nextSteps;
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_DATA = {

  agenda: [
    { item: "Welcome, introductions & purpose of the meeting", duration: "5 min",  led: "Lockated" },
    { item: "Overview of the project — scope & objectives",    duration: "5 min",  led: "Lockated" },
    { item: "Walkthrough of the Discovery Deck — section by section", duration: "30 min", led: "Lockated" },
    { item: "Open discussion — team questions and clarifications",    duration: "15 min", led: "Both" },
    { item: "Next steps, submission deadline and workshop schedule",  duration: "5 min",  led: "Lockated" },
  ] as AgendaItem[],

  discussion: [
    {
      title: "Purpose & Context",
      body: "The session was opened by clarifying the purpose of the meeting — to walk the team through the Discovery Questionnaire before they complete and return it. This is a collaborative working session where the team's inputs will directly shape the project's design, features, and communication strategy.",
    },
    {
      title: "Key Points Emphasised",
      points: [
        { text: "Responses should be specific and example-driven. Vague answers are not actionable for design and development." },
        { text: "The more thoroughly the deck is completed before the workshop, the more productive the workshop will be." },
        { text: "Any existing documents should be attached or linked, even if outdated." },
        { text: "Both the Team Head and Business Head are required to attend the workshop — sign-off authority is needed." },
      ],
    },
    // {
    //   title: "Questions & Clarifications",
    //   body: "Please update this section with any specific questions raised by the team during the meeting, along with responses provided. Fill this in immediately after the meeting while the discussion is fresh.",
    // },
  ] as DiscussionSection[],

  decisions: [
    "The team will complete the discovery questionnaire and return it by the agreed deadline.",
    "The completed deck should include all brand guidelines, colour palette, typography details, and any existing persona or audience insight documents.",
    "Where the team prefers to fill tables in Excel or a separate document, they may do so and attach the link.",
    "The workshop is confirmed as part of the agreed workshop week. Exact date and time to be confirmed separately.",
    "Any questions on the deck prior to submission should be directed to the project manager rather than waiting for the workshop.",
  ] as string[],

  nextSteps: [
    { date: "Within 24 hours", activity: "MOM shared with all attendees" },
    { date: "Within 1 week",   activity: "Team completes and returns the discovery questionnaire deck" },
    { date: "Before workshop", activity: "Lockated reviews the deck and prepares workshop agenda and discussion guide" },
    { date: "Workshop week",   activity: "All-teams alignment call — Team Heads across all workstreams" },
    { date: "Post-workshops",  activity: "Lockated consolidates workshop outputs into BRDs and process flow documentation" },
    { date: "Following month", activity: "Design phase begins — wireframes and UI for Phase 1 module" },
  ] as NextStepRow[],

};



// ─── Colors ──────────────────────────────────────────────────────────────────

const COLOR = {
  navy:         "#1a2433",
  white:        "#ffffff",
  textDark:     "#1a2433",
  textMid:      "#4a5568",
  textLight:    "#718096",
  tableHeaderBg:"#1a2433",
  tableRowAlt:  "#f0f4ee",
  border:       "#cdd6cf",
  staticBg:     "#f8f9fa",
  staticBorder: "#dee2e6",
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLOR.white,
    paddingBottom: 48,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  headerBar: {
    backgroundColor: COLOR.navy,
    paddingHorizontal: 30,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerBarLeft: { 
    flexDirection: "column" 
  },

  headerTitle: { 
    color: COLOR.white,
     fontSize: 13, 
     fontFamily: "Helvetica-Bold",
     letterSpacing: 0.3 
    },
  headerSubtitle:  { 
    color: "#aab8c2",
     fontSize: 7.5, marginTop: 3
     },
  headerRight: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  headerConfidential: { 
    color: "#aab8c2", 
    fontSize: 7, 
    letterSpacing: 1 
  },
  headerDot: { color: "#aab8c2", 
    fontSize: 7, 
    marginHorizontal: 4 
  },
  headerBrand:  { 
    color: COLOR.white, 
    fontSize: 7, 
    fontFamily: "Helvetica-Bold"
   },
  body: {
     paddingHorizontal: 30, 
     paddingTop: 20 
    },
  pageTitle: { 
    fontSize: 20, 
    fontFamily: "Helvetica-Bold",
     color: COLOR.textDark 
    },
  pageTitleSub:{ 
    fontSize: 8, 
    color: COLOR.textMid,
     marginTop: 3, marginBottom: 8 
    },
  titleUnderline: { 
    height: 1,
     backgroundColor: COLOR.border, 
     marginBottom: 14 
    },
  infoGrid: {
     flexDirection: "row", 
     marginBottom: 18, 
     borderWidth: 1, 
     borderColor: COLOR.border 
    },
  infoCol:{ 
    flex: 1 
  },
  infoCell:{ 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: COLOR.border, 
    minHeight: 24 
  },
  infoCellLast:{ 
    flexDirection: "row",
     minHeight: 24 
    },
  infoCellDivider:{ 
    borderLeftWidth: 1,
     borderLeftColor: COLOR.border
     },
  infoCellLabel: { 
    backgroundColor: COLOR.navy, 
    color: COLOR.white,
     fontSize: 7.5, 
     fontFamily: "Helvetica-Bold", 
     paddingHorizontal: 8, 
     paddingVertical: 5,
      width: 90, 
      justifyContent: "center" 
    },
  infoCellValue: { 
    color: COLOR.textDark,
     fontSize: 8,
      paddingHorizontal: 8,
       paddingVertical: 5, 
       flex: 1, 
       justifyContent: "center"
       },
  sectionLabelRow:{ 
    flexDirection: "row",
     alignItems: "center", 
     marginBottom: 4,
      marginTop: 10 
    },
  sectionLabelNumber: {
     color: COLOR.textLight, 
     fontSize: 7.5,
      fontFamily: "Helvetica-Bold", 
      letterSpacing: 1 
    },
  sectionHeading: { 
    fontSize: 12,
     fontFamily: "Helvetica-Bold",
      color: COLOR.textDark,
       marginBottom: 8 
      },
  table: { 
    marginBottom: 16 
  },
  tableHeader:{ 
    flexDirection: "row",
     backgroundColor: COLOR.tableHeaderBg
     },
  tableRow:{
     flexDirection: "row", 
     borderBottomWidth: 1, 
     borderBottomColor: COLOR.border, 
     borderLeftWidth: 1, 
     borderLeftColor: COLOR.border, 
     borderRightWidth: 1,
      borderRightColor: COLOR.border, 
      backgroundColor: COLOR.white
     },
  tableRowAlt: { 
    flexDirection: "row",
     borderBottomWidth: 1,
      borderBottomColor: COLOR.border,
       borderLeftWidth: 1, 
       borderLeftColor: COLOR.border, 
       borderRightWidth: 1, 
       borderRightColor: COLOR.border, 
       backgroundColor: COLOR.tableRowAlt
       },
  thCell:{ 
    color: COLOR.white, 
    fontSize: 7.5,
     fontFamily: "Helvetica-Bold",
      paddingHorizontal: 8, 
      paddingVertical: 6 
    },
  tdCell:{
     color: COLOR.textDark, 
     fontSize: 8,
      paddingHorizontal: 8, 
      paddingVertical: 5 
    },
  staticBlock:{ 
    backgroundColor:COLOR.staticBg,
     borderWidth: 1, 
     borderColor: COLOR.staticBorder, 
     borderRadius: 2, 
     paddingHorizontal: 12, 
     paddingVertical: 10,
      marginBottom: 6, 
  },
  staticBlockTitle:  { 
    fontSize: 8,
     fontFamily: "Helvetica-Bold", 
     color: COLOR.textDark,
      marginBottom: 4
   },
  staticBlockBody:   { 
    fontSize: 8, 
    color: COLOR.textMid, 
    lineHeight: 1.5 
  },
  staticBulletRow:    { 
    flexDirection: "row",
     marginBottom: 3 
    },
  staticBulletDash:   { 
    fontSize: 8, 
    color: COLOR.textMid, 
    width: 12 
  },
  staticBulletText:   {
     fontSize: 8, 
     color: COLOR.textMid,
      flex: 1, 
      lineHeight: 1.5 
    },
  decisionRow:        {
     flexDirection: "row",
      marginBottom: 6
     },
  decisionNumber:     { 
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
     color: COLOR.textDark,
      width: 16 
    },
  decisionText: { 
    fontSize: 8, 
    color: COLOR.textMid, 
    flex: 1, 
    lineHeight: 1.5 
  },
  footer:{ 
    position: "absolute", 
    bottom: 0, 
    left: 0,
     right: 0,
      backgroundColor: COLOR.navy, 
      paddingHorizontal: 30,
       paddingVertical: 8, 
       flexDirection: "row", 
       justifyContent: "space-between", 
       alignItems: "center" ,
       marginTop:"auto",
      },
  footerText: {
     color: "#aab8c2", 
     fontSize: 7 
    },
  footerPage:  { 
    color: "#aab8c2", 
    fontSize: 7
   },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const capitalize = (s?: string | null) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoCell = ({ label, value, divider = false, last = false }: {
  label: string; value: string; divider?: boolean; last?: boolean;
}) => (
  <View style={[last ? styles.infoCellLast : styles.infoCell, divider ? styles.infoCellDivider : {}]}>
    <View style={styles.infoCellLabel}><Text>{label}</Text></View>
    <View style={styles.infoCellValue}><Text>{value}</Text></View>
  </View>
);

const SectionLabel = ({ number, label }: { number: string; label: string }) => (
  <View style={styles.sectionLabelRow}>
    <Text style={styles.sectionLabelNumber}>{number} · {label}</Text>
  </View>
);

// ─── PDF Component ────────────────────────────────────────────────────────────

interface MoMPdfProps {
  data: MomData;
}

const MoMPdf = ({ data }: MoMPdfProps) => {
  const attendees = data.mom_attendees ?? [];
  const tasks     = data.mom_tasks     ?? [];
  const rp        = data.responsible_person ?? null;

  // ── When API is ready, replace each line below with: data.field ?? MOCK_DATA.field ──
  const agenda     = data.agenda_items       ?? MOCK_DATA.agenda;
  const discussion = data.discussion_summary ?? MOCK_DATA.discussion;
  const decisions  = data.decisions          ?? MOCK_DATA.decisions;
  const nextSteps  = data.next_steps         ?? MOCK_DATA.nextSteps;

  const meetingTypeLabel = [data.meeting_type, data.meeting_mode]
    .filter(Boolean).map(capitalize).join(" — ") || "General Meeting";

  return (
    <Document> 
      <Page size="A4" style={styles.page}> 

        {/* ── HEADER ── */}
        <View style={styles.headerBar}>
          <View style={styles.headerBarLeft}>
            <Text style={styles.headerTitle}>Minutes of Meeting</Text>
            <Text style={styles.headerSubtitle}>{data.title} · {capitalize(data.meeting_type)} Meeting</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerConfidential}>CONFIDENTIAL</Text>
            <Text style={styles.headerDot}>·</Text>
            <Text style={styles.headerBrand}>LOCKATED</Text>
          </View>
        </View>   

        <View style={styles.body}>

          {/* ── PAGE TITLE ── */}
          <Text style={styles.pageTitle}>Minutes of Meeting</Text>
          <Text style={styles.pageTitleSub}>{data.title}</Text>
          <View style={styles.titleUnderline} />

          {/* ── INFO GRID ── */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <InfoCell label="Date"  value={formatDate(data.meeting_date) || "To be updated"} />
              <InfoCell label="Meeting Type"    value={meetingTypeLabel} />
              <InfoCell label="MOM Prepared by" value={rp?.name || "Project Team"} last />
            </View>
            <View style={styles.infoCol}>
              <InfoCell label="Time"          value="To be updated" divider />
              <InfoCell label="Duration"      value="60 minutes"    divider />
              <InfoCell label="MOM Shared on" value={formatDate(data.meeting_date) || "To be updated"} divider last />
            </View>
          </View>

          {/* ══════════════════════════════════════════
              01 · ATTENDEES — source: data.mom_attendees (API)
          ══════════════════════════════════════════ */}
          <SectionLabel number="01" label="ATTENDEES" />
          <Text style={styles.sectionHeading}>Meeting Participants</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, { flex: 1.5 }]}>Name</Text>
              <Text style={[styles.thCell, { flex: 1.5 }]}>Email</Text>
              <Text style={[styles.thCell, { flex: 1   }]}>Organisation</Text>
              <Text style={[styles.thCell, { flex: 1   }]}>Role in Meeting</Text>
            </View>
            {attendees.length === 0 ? (
              <View style={styles.tableRow}>
                <Text style={[styles.tdCell, { flex: 1 }]}>No attendees recorded.</Text>
              </View>
            ) : (
              attendees.map((a, i) => (
                <View key={a.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tdCell, { flex: 1.5 }]}>{a.name || a.mom_attendee_user?.name || "To be updated"}</Text>
                  <Text style={[styles.tdCell, { flex: 1.5 }]}>{a.email || a.mom_attendee_user?.email || "To be updated"}</Text>
                  <Text style={[styles.tdCell, { flex: 1   }]}>{a.organization || "Internal"}</Text>
                  <Text style={[styles.tdCell, { flex: 1   }]}>{a.role || "Attendee"}</Text>
                </View>
              ))
            )}
          </View>

          {/* ══════════════════════════════════════════
              02 · AGENDA — source: MOCK_DATA.agenda → future: data.agenda_items
          ══════════════════════════════════════════ */}
          <SectionLabel number="02" label="AGENDA" />
          <Text style={styles.sectionHeading}>Meeting Agenda — As Followed</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, { flex: 0.3 }]}>#</Text>
              <Text style={[styles.thCell, { flex: 3   }]}>Agenda Item</Text>
              <Text style={[styles.thCell, { flex: 0.8 }]}>Duration</Text>
              <Text style={[styles.thCell, { flex: 1   }]}>Led By</Text>
            </View>
            {agenda.map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tdCell, { flex: 0.3 }]}>{i + 1}</Text>
                <Text style={[styles.tdCell, { flex: 3   }]}>{row.item}</Text>
                <Text style={[styles.tdCell, { flex: 0.8 }]}>{row.duration}</Text>
                <Text style={[styles.tdCell, { flex: 1   }]}>{row.led}</Text>
              </View>
            ))}
          </View>

          {/* ══════════════════════════════════════════
              03 · DISCUSSION SUMMARY — source: MOCK_DATA.discussion → future: data.discussion_summary
          ══════════════════════════════════════════ */}
          <SectionLabel number="03" label="DISCUSSION SUMMARY" />
          <Text style={styles.sectionHeading}>Key Points Discussed</Text>
          {discussion.map((section, i) => (
            <View key={i} style={styles.staticBlock}>
              <Text style={styles.staticBlockTitle}>{section.title}</Text>
              {/* Paragraph body */}
              {section.body && (
                <Text style={styles.staticBlockBody}>{section.body}</Text>
              )}
              {/* Bullet points */}
              {section.points && section.points.map((point, j) => (
                <View key={j} style={styles.staticBulletRow}>
                  <Text style={styles.staticBulletDash}>—</Text>
                  <Text style={styles.staticBulletText}>{point.text}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* ══════════════════════════════════════════
              04 · DECISIONS — source: MOCK_DATA.decisions → future: data.decisions
          ══════════════════════════════════════════ */}
          <SectionLabel number="04" label="DECISIONS" />
          <Text style={styles.sectionHeading}>Decisions Made in This Meeting</Text>
          {decisions.map((decision, i) => (
            <View key={i} style={styles.decisionRow}>
              <Text style={styles.decisionNumber}>{i + 1}</Text>
              <Text style={styles.decisionText}>{decision}</Text>
            </View>
          ))}

          {/* ══════════════════════════════════════════
              05 · ACTION ITEMS — source: data.mom_tasks (API)
          ══════════════════════════════════════════ */}
          <SectionLabel number="05" label="ACTION ITEMS" />
          <Text style={styles.sectionHeading}>Action Items & Owners</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, { flex: 1.2 }]}>Owner</Text>
              <Text style={[styles.thCell, { flex: 2.5 }]}>Action</Text>
              <Text style={[styles.thCell, { flex: 0.8 }]}>Deadline</Text>
              <Text style={[styles.thCell, { flex: 0.7 }]}>Status</Text>
            </View>
            {tasks.length === 0 ? (
              <View style={styles.tableRow}>
                <Text style={[styles.tdCell, { flex: 1 }]}>No action items recorded.</Text>
              </View>
            ) : (
              tasks.map((t, i) => (
                <View key={t.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tdCell, { flex: 1.2 }]}>{t.responsible_person_name || "To be assigned"}</Text>
                  <Text style={[styles.tdCell, { flex: 2.5 }]}>{t.description || "To be updated"}</Text>
                  <Text style={[styles.tdCell, { flex: 0.8 }]}>{formatDate(t.target_date) || "To be updated"}</Text>
                  <Text style={[styles.tdCell, { flex: 0.7 }]}>{capitalize(t.status) || "Open"}</Text>
                </View>
              ))
            )}
          </View>
          
          {/* ══════════════════════════════════════════
              06 · NEXT STEPS — source: MOCK_DATA.nextSteps → future: data.next_steps
          ══════════════════════════════════════════ */}
          <SectionLabel number="06" label="NEXT STEPS" />
          <Text style={styles.sectionHeading}>What Happens Next</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, { flex: 1 }]}>Date / Milestone</Text>
              <Text style={[styles.thCell, { flex: 3 }]}>Activity</Text>
            </View>
            {nextSteps.map((row, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tdCell, { flex: 1 }]}>{row.date}</Text>
                <Text style={[styles.tdCell, { flex: 3 }]}>{row.activity}</Text>
              </View>
            ))}
          </View>
       
          {/* ══════════════════════════════════════════
              07 · MOM OWNER — source: data.responsible_person (API)
          ══════════════════════════════════════════ */}
          <SectionLabel number="07" label="MOM OWNER" />
          <Text style={styles.sectionHeading}>Prepared By</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thCell, { flex: 1 }]}>Name</Text>
              <Text style={[styles.thCell, { flex: 2 }]}>Email</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tdCell, { flex: 1 }]}>{rp?.name  || "To be assigned"}</Text>
              <Text style={[styles.tdCell, { flex: 2 }]}>{rp?.email || "To be updated"}</Text>
            </View>
          </View>

        </View>

        {/* ── FOOTER ── */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>Generated {formatDate(new Date().toISOString())} · {data.title}</Text>
          <Text style={styles.footerPage}>Page 1</Text>
        </View> */}

        {/* ── FOOTER — fixed on every page ── */}
<View style={styles.footer} fixed>  {/* ← fixed prop repeats on every page */}
  <Text style={styles.footerText}>
    Generated {formatDate(new Date().toISOString())} · {data.title}
  </Text>
  <Text
    style={styles.footerPage}
    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
  />
</View>  

      </Page>
    </Document>
  );
};

 
export default MoMPdf;



