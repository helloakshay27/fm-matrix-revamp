// @ts-nocheck
import { useJobs } from '../JobsContext';
import { T, COLORS, SETUP_TABS, STATES_INDIA, COUNTRIES, EMPLOYEE_RANGES, INDUSTRIES } from '../constants';
import { I, ico } from '../icons';
import { card, g2, g3, FI, FS, FT, Fld, Btn, StatusPill, pill, secTitle, aBtn } from './UI';

export default function OrgSection() {
  const {
    setupTab, setSetupTab,
    logoPreview, fileRef,
    deptSearch, setDeptSearch,
    showDeptModal, setShowDeptModal,
    editingDept, setEditingDept,
    deptForm, setDeptForm,
    filteredDepts,
    handleLogoUpload,
    openDeptModal,
    saveDept,
    deleteDept,
    showToast,
  } = useJobs();

  const divider = { height: 1, background: T.borderSoft, margin: "0 0 28px" };

  const CompanyDetails = () => (
    <div style={card}>
      {secTitle(
        ico.layers,
        "Basic Information",
        "Core identity of your organisation"
      )}
      <div style={g2}>
        <Fld label="Company Name *">
          <FI placeholder="e.g. Lockated Technologies Pvt. Ltd." />
        </Fld>
        <Fld label="Company Registration ID">
          <FI placeholder="e.g. CIN U72200MH2018PTC123456" />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Industry / Sector *">
          <FS>
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </FS>
        </Fld>
        <Fld label="Year of Establishment">
          <FI type="number" placeholder="e.g. 2018" />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Company Logo">
          <div
            style={{
              width: "100%",
              minHeight: 100,
              border: `2px dashed ${T.borderWarm}`,
              borderRadius: T.rmd,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              background: T.surface,
              transition: "all .16s",
            }}
            onClick={() => fileRef.current?.click()}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = T.orange;
              e.currentTarget.style.background = T.orangeSoft;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = T.borderWarm;
              e.currentTarget.style.background = T.surface;
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleLogoUpload}
            />
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: T.rmd,
                  objectFit: "contain",
                  border: `1px solid ${T.borderSoft}`,
                }}
              />
            ) : (
              <>
                <span style={{ color: T.inkMuted }}>{ico.arrowLeft}</span>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}
                >
                  Upload logo
                </span>
                <span style={{ fontSize: 11, color: T.inkMuted }}>
                  PNG, JPG, SVG — max 2 MB
                </span>
              </>
            )}
          </div>
        </Fld>
        <Fld label="Number of Employees *">
          <FS>
            <option value="">Select range</option>
            {EMPLOYEE_RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </FS>
        </Fld>
      </div>
      <div style={{ marginBottom: 18 }}>
        <Fld label="Business Description">
          <FT placeholder="Briefly describe what your company does, its core offerings, and value proposition..." />
        </Fld>
      </div>

      <div style={divider} />
      {secTitle(
        <I d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" />,
        "Owner / Founder Details",
        "Primary point of contact for this account"
      )}
      <div style={g2}>
        <Fld label="Full Name *">
          <FI placeholder="e.g. Rajesh Kumar" />
        </Fld>
        <Fld label="Designation">
          <FI placeholder="e.g. CEO & Founder" />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Email Address *">
          <FI type="email" placeholder="e.g. rajesh@company.com" />
        </Fld>
        <Fld label="Phone Number *">
          <FI type="tel" placeholder="e.g. +91 98765 43210" />
        </Fld>
      </div>

      <div style={divider} />
      {secTitle(
        ico.doc,
        "Business Registration",
        "Statutory and compliance identifiers"
      )}
      <div style={g3}>
        <Fld label="GSTIN">
          <FI placeholder="e.g. 27AABCU9603R1ZM" />
        </Fld>
        <Fld label="PAN">
          <FI placeholder="e.g. AABCU9603R" />
        </Fld>
        <Fld label="CIN">
          <FI placeholder="e.g. U72200MH2018PTC" />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Company Website">
          <FI type="url" placeholder="e.g. https://www.company.com" />
        </Fld>
        <Fld label="Company Email Domain">
          <FI placeholder="e.g. @company.com" />
        </Fld>
      </div>

      <div style={divider} />
      {secTitle(
        <I d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z" />,
        "Registered Address",
        "Primary office location"
      )}
      <div style={g2}>
        <Fld label="Address Line 1 *">
          <FI placeholder="e.g. 501, Tower A, Business Park" />
        </Fld>
        <Fld label="Address Line 2">
          <FI placeholder="e.g. Near Metro Station, Sector 5" />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="City *">
          <FI placeholder="e.g. Mumbai" />
        </Fld>
        <Fld label="State / Province *">
          <FS>
            <option value="">Select state</option>
            {STATES_INDIA.map((st) => (
              <option key={st}>{st}</option>
            ))}
          </FS>
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Country *">
          <FS>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </FS>
        </Fld>
        <Fld label="PIN / ZIP Code *">
          <FI placeholder="e.g. 400001" />
        </Fld>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          paddingTop: 24,
          borderTop: `1px solid ${T.borderSoft}`,
          marginTop: 8,
        }}
      >
        <Btn>Cancel</Btn>
        <Btn primary onClick={() => showToast("Company details saved")}>
          {ico.check} Save Details
        </Btn>
      </div>
    </div>
  );

  const DeptList = () => (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 14px",
            background: T.raised,
            border: `1px solid ${T.borderSoft}`,
            borderRadius: T.rmd,
            minHeight: 40,
            width: 260,
          }}
        >
          <span style={{ display: "flex", color: T.inkMuted }}>
            {ico.search}
          </span>
          <input
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: T.font,
              color: T.ink,
            }}
            placeholder="Search departments..."
            value={deptSearch}
            onChange={(e) => setDeptSearch(e.target.value)}
          />
        </div>
        <Btn primary onClick={() => openDeptModal()}>
          {ico.plus} Add Department
        </Btn>
      </div>
      {filteredDepts.length === 0 ? (
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 36, marginBottom: 12 }}>🏢</span>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.inkSoft,
              margin: "0 0 4px",
            }}
          >
            No departments found
          </p>
          <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "0 0 16px" }}>
            Create your first department to start organising your team.
          </p>
          <Btn primary onClick={() => openDeptModal()}>
            {ico.plus} Add Department
          </Btn>
        </div>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {filteredDepts.map((d, i) => (
            <div
              key={d.id}
              style={{ ...card, position: "relative", overflow: "hidden" }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: d.color || COLORS[i % 5],
                  borderRadius: "16px 16px 0 0",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  display: "flex",
                  gap: 4,
                }}
              >
                <button
                  style={aBtn}
                  onClick={() => openDeptModal(d)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = T.orangeSoft;
                    e.currentTarget.style.color = T.orange;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = T.raised;
                    e.currentTarget.style.color = T.inkMuted;
                  }}
                >
                  {ico.edit}
                </button>
                <button
                  style={aBtn}
                  onClick={() => deleteDept(d.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(228,145,145,.1)";
                    e.currentTarget.style.color = T.danger;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = T.raised;
                    e.currentTarget.style.color = T.inkMuted;
                  }}
                >
                  {ico.trash}
                </button>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                {d.name}
              </p>
              <div
                style={{
                  fontSize: 12,
                  color: T.inkSoft,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {ico.people} {d.head}
                </span>
                <span>·</span>
                <span>{d.members} members</span>
              </div>
              <StatusPill s={d.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}
        >
          Organisation Setup
        </h1>
        <p
          style={{
            fontSize: 13.5,
            color: T.inkSoft,
            marginTop: 4,
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Configure your company profile and team structure to get started.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 4,
          background: T.raised,
          borderRadius: T.rmd,
          border: `1px solid ${T.borderSoft}`,
          width: "fit-content",
          marginBottom: 28,
        }}
      >
        {SETUP_TABS.map((t) => (
          <button
            key={t.key}
            style={pill(setupTab === t.key)}
            onClick={() => setSetupTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {setupTab === "company" && <CompanyDetails />}
      {setupTab === "departments" && <DeptList />}
    </div>
  );
}
