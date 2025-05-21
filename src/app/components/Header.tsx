import React from 'react';
import { FaCalculator } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <FaCalculator className="text-3xl mr-3" />
        <div>
          <h1 className="text-2xl font-bold">Totara LMS AI Cost Calculator</h1>
          <p className="text-sm opacity-80">Evaluate costs for AI model usage across different features</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
