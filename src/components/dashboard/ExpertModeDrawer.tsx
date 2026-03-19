import React from 'react';
const ExpertModeDrawer = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '300px', height: '100vh', background: 'white', boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', zIndex: 9999, padding: '20px' }}>
      <h2>Expert Settings</h2>
      <button onClick={() => onClose?.()}>Close</button>
      <p>The drawer is working! We will add features back one by one later.</p>
    </div>
  );
};
export default ExpertModeDrawer;
