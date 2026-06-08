export default function TopNav() {
  return (
    <div className="topnav">
      <div className="logo">
        <div className="logo-mark">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.5L19 8.5v7L12 19.5 5 15.5v-7L12 4.5z" />
          </svg>
        </div>
        <div>
          <div className="logo-text">Lockated — PATM</div>
          <div className="logo-sub">Project &amp; Task Management · CEO Dashboard · May 2026</div>
        </div>
      </div>
      <div className="nav-right">
        <div className="momentum">
          <div className="mom" style={{ color: '#E7848E', borderColor: '#E7848E33' }}>⚠ 8 Critical Projects</div>
          <div className="mom" style={{ color: '#EDC488', borderColor: '#EDC48844' }}>↑ Backlog Growing</div>
          <div className="mom" style={{ color: '#108C72', borderColor: '#108C7230' }}>✓ 2,735 Tasks Done</div>
        </div>
        <div className="date-tag">07 May 2026 · Live</div>
      </div>
    </div>
  );
}
