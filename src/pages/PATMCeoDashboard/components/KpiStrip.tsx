export default function KpiStrip() {
  return (
    <div className="kpi-strip g6">
      <div className="ki">
        <div className="kt">Projects</div>
        <div className="kv">39</div>
        <div className="ks" style={{ color: 'rgba(255,255,255,.8)' }}>8 critical · 16 at risk</div>
        <div className="kc">15 healthy</div>
      </div>
      <div className="ki">
        <div className="kt">Tasks</div>
        <div className="kv" style={{ color: '#EDC488' }}>22,218</div>
        <div className="pw">
          <div className="pb" style={{ width: '24%', background: '#9EC8BA' }} />
        </div>
        <div className="ks" style={{ color: 'rgba(255,255,255,.9)' }}>5,312 done · 24%</div>
        <div className="kc">2,192 overdue · 7,141 open</div>
      </div>
      <div className="ki">
        <div className="kt">To-Dos</div>
        <div className="kv">1,879</div>
        <div className="ks" style={{ color: 'rgba(255,255,255,.8)' }}>Open · In Progress</div>
        <div className="kc">Standalone actions</div>
      </div>
      <div className="ki">
        <div className="kt">Issues</div>
        <div className="kv" style={{ color: '#E7848E' }}>1,852</div>
        <div className="ks" style={{ color: '#E7848E' }}>175 open · 31 reopen</div>
        <div className="kc">907 completed · 688 closed</div>
      </div>
      <div className="ki">
        <div className="kt">Milestones</div>
        <div className="kv" style={{ color: '#EDC488' }}>1,616</div>
        <div className="pw">
          <div className="pb" style={{ width: '9%', background: '#E7848E' }} />
        </div>
        <div className="ks" style={{ color: '#E7848E' }}>142 done · 8.8%</div>
        <div className="kc">1,161 in progress · avg 9.5%</div>
      </div>
      <div className="ki">
        <div className="kt">Sprint Health</div>
        <div className="kv" style={{ color: '#EDC488' }}>22%</div>
        <div className="pw">
          <div className="pb" style={{ width: '22%', background: '#E7848E' }} />
        </div>
        <div className="ks" style={{ color: '#E7848E' }}>1 real sprint of 9</div>
        <div className="kc">7 abandoned or test</div>
      </div>
    </div>
  );
}
