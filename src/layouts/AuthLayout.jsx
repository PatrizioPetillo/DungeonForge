import React from 'react';
import '../styles/authLayout.css'; // Assuming you have styles for the layout

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">DungeonForge</h1>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
