import React from 'react';

const IframeDashboardMsafe: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="https://reports.lockated.com/vi-msafe/?token=10b1d3d490656b1e6fdb7932f1a8c125171245bcd90c177d"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="MSafe Dashboard"
        allow="fullscreen"
      />
    </div>
  );
};

export default IframeDashboardMsafe;
