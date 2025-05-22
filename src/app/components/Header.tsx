import React from 'react';
import { theme } from '../theme';

interface HeaderProps {
  onExportSettings: () => void;
  onExportResults: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExportSettings, onExportResults, onReset }) => {
  return (
    <header
      style={{
        background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
        color: theme.textOnPrimary
      }}
      className="text-white p-4 shadow-md"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="/totara_logo.svg" alt="Totara Logo" className="h-16 w-16 mr-5" />
          <div>
            <h1 className="text-2xl font-bold">Totara LMS AI Cost Calculator</h1>
            <p className="text-sm opacity-80">Evaluate costs for AI model usage across different AI Interactions</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onExportResults}
            style={{ backgroundColor: theme.primary, color: theme.textOnPrimary }}
            className="px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2"
          >
            Export Results
          </button>
          <button
            onClick={onExportSettings}
            style={{ backgroundColor: theme.primary, color: theme.textOnPrimary }}
            className="px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2"
          >
            Export Settings
          </button>
          <button
            onClick={onReset}
            style={{ backgroundColor: '#e74c3c', color: theme.textOnPrimary }}
            className="px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
