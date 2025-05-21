import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface SummaryPanelProps {
  totalCost: {
    min: number;
    max: number;
  };
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ totalCost }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cost Summary</h2>
      
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-gray-600">Estimated Monthly Cost</p>
          <p className="text-3xl font-bold text-blue-700">
            {totalCost.min === totalCost.max
              ? formatCurrency(totalCost.min)
              : `${formatCurrency(totalCost.min)} - ${formatCurrency(totalCost.max)}`}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm max-w-md">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">
                This estimate is based on current model pricing and your configured usage patterns. 
                Actual costs may vary based on real-world usage and any pricing changes from providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
