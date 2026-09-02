import React, { createContext, useCallback, useContext, useState } from 'react';

interface DrillEntry {
  title: string;
  sub: string;
  bodyHTML: string;
}

interface DrillContextValue {
  openDrill: (title: string, sub: string, bodyHTML: string) => void;
  closeDrill: () => void;
}

const DrillContext = createContext<DrillContextValue | null>(null);

export function useDrill(): DrillContextValue {
  const ctx = useContext(DrillContext);
  if (!ctx) throw new Error('useDrill must be used within a DrillProvider');
  return ctx;
}

export const DrillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<DrillEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openDrill = useCallback((title: string, sub: string, bodyHTML: string) => {
    setStack([{ title, sub, bodyHTML }]);
    setIsOpen(true);
  }, []);

  const closeDrill = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goCrumb = useCallback((i: number) => {
    setStack((prev) => prev.slice(0, i + 1));
  }, []);

  const top = stack[stack.length - 1];

  return (
    <DrillContext.Provider value={{ openDrill, closeDrill }}>
      {children}
      <div id="overlay" className={isOpen ? 'show' : ''} onClick={closeDrill} />
      <div id="drillPanel" className={isOpen ? 'open' : ''}>
        <span className="closeX" onClick={closeDrill}>×</span>
        <div className="breadcrumb">
          {stack.length > 1 &&
            stack.map((c, i) =>
              i < stack.length - 1 ? (
                <span key={i} onClick={() => goCrumb(i)}>
                  {c.title} /{' '}
                </span>
              ) : (
                <React.Fragment key={i}>{c.title}</React.Fragment>
              )
            )}
        </div>
        {top && (
          <>
            <div className="drill-title">{top.title}</div>
            <div className="drill-sub">{top.sub}</div>
            <div dangerouslySetInnerHTML={{ __html: top.bodyHTML }} />
          </>
        )}
      </div>
    </DrillContext.Provider>
  );
};
