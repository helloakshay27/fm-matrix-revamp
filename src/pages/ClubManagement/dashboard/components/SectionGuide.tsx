import React, { useState } from 'react';

export interface SectionGuideItem {
  id: string;
  label: string;
}

export const SectionGuide: React.FC<{ sections: SectionGuideItem[] }> = ({ sections }) => {
  const [active, setActive] = useState(0);

  const jump = (id: string, i: number) => {
    setActive(i);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="section-guide">
      {sections.map((s, i) => (
        <button key={s.id} className={'sg-btn' + (active === i ? ' active' : '')} onClick={() => jump(s.id, i)}>
          {s.label}
        </button>
      ))}
    </div>
  );
};
