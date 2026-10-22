import { useEffect } from 'react';
import { useAccountingDashboard } from '../context/accountingDashboardStore';

/**
 * Module navigation for the Workflow Usage layer.
 * Displays modules as text tabs and submodules as pills.
 */
export function ModuleNav() {
  const { 
    modulesList, selectedModule, setSelectedModule, flowsLoading,
    subModulesList, selectedSubModule, setSelectedSubModule, subModulesLoading
  } = useAccountingDashboard();

  // "More" dropdown logic for modules
  const maxVisibleModules = 8;
  const visibleModules = modulesList.slice(0, maxVisibleModules);
  const moreModules = modulesList.slice(maxVisibleModules);

  // "More" dropdown logic for submodules
  const maxVisibleSubModules = 8;
  const visibleSubModules = subModulesList.slice(0, maxVisibleSubModules);
  const moreSubModules = subModulesList.slice(maxVisibleSubModules);

  useEffect(() => {
    if (modulesList.length > 0 && selectedModule === null) {
      setSelectedModule(modulesList[0].name);
    }
  }, [modulesList, selectedModule, setSelectedModule]);

  const handleModuleSelect = (m: string) => {
    if (m === selectedModule) return; // Prevent deselecting
    setSelectedModule(m);
    setSelectedSubModule(null); // Reset submodule when module changes
  };

  return (
    <div className="mnav" id="modNav" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
      {/* 1. Modules Row (Tabs) */}
      <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid var(--border)' }}>
        {flowsLoading && modulesList.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="segbar-skeleton" style={{ width: 80, height: 24, borderRadius: 4, background: 'var(--surface2)', opacity: 0.5, marginBottom: '12px' }} />
          ))
        ) : (
          <>
            {visibleModules.map((m) => {
              const displayName = m.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toLowerCase());
              const isSelected = m.name === selectedModule;
              return (
                <div
                  key={m.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleModuleSelect(m.name)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleModuleSelect(m.name); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderRadius: 0,
                    padding: '0 0 12px 0',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: isSelected ? 500 : 400,
                    color: isSelected ? 'var(--text)' : 'var(--muted)',
                    borderBottom: isSelected ? '2px solid var(--text)' : '2px solid transparent',
                    textTransform: 'lowercase',
                  }}
                >
                  {displayName}
                </div>
              );
            })}
            
            {moreModules.length > 0 && (
              <select 
                onChange={(e) => handleModuleSelect(e.target.value)}
                value={moreModules.some(m => m.name === selectedModule) ? (selectedModule || '') : ""}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: '13px',
                  color: 'var(--muted)',
                  outline: 'none',
                  cursor: 'pointer',
                  maxWidth: '180px',
                  textOverflow: 'ellipsis',
                  marginBottom: '12px'
                }}
              >
                <option value="" disabled>More ({moreModules.length})...</option>
                {moreModules.map((m) => (
                  <option key={m.name} value={m.name}>{m.name.replace(/_/g, ' ')}</option>
                ))}
              </select>
            )}
          </>
        )}
      </div>

      {/* 2. Submodules Row (Pills) — only shown when the selected module has real sub-paths */}
      {selectedModule && subModulesList.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {visibleSubModules.map((sm) => {
            const displayName = sm.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toLowerCase());
            const isSelected = sm.name === selectedSubModule;
            return (
              <button
                key={sm.name}
                type="button"
                onClick={() => setSelectedSubModule(isSelected ? null : sm.name)}
                style={{
                  background: isSelected ? 'var(--text)' : 'transparent',
                  color: isSelected ? 'var(--bg)' : 'var(--muted)',
                  border: isSelected ? '1px solid var(--text)' : '1px solid var(--border)',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  textTransform: 'lowercase',
                }}
              >
                {displayName}
              </button>
            );
          })}

          {moreSubModules.length > 0 && (
            <select
              onChange={(e) => setSelectedSubModule(e.target.value)}
              value={moreSubModules.some(sm => sm.name === selectedSubModule) ? (selectedSubModule || '') : ""}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                background: 'transparent',
                fontSize: '13px',
                color: 'var(--muted)',
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '180px',
                textOverflow: 'ellipsis',
              }}
            >
              <option value="" disabled>More ({moreSubModules.length})...</option>
              {moreSubModules.map((sm) => (
                <option key={sm.name} value={sm.name}>{sm.name.replace(/_/g, ' ')}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
