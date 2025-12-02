import React from 'react';

const IframeDashboardMsafe: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          🚧
        </div>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: '#1a1a1a'
        }}>
          Coming Soon
        </h1>
        <p style={{ 
          fontSize: '1rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          The MSafe Dashboard is currently under development.<br />
          Please check back later.
        </p>
      </div>
    </div>
  );
};

export default IframeDashboardMsafe;
