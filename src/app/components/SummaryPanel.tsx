import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { theme } from '../theme';

interface SummaryPanelProps {
  totalCost: {
    min: number;
    max: number;
  };
  results: Array<{
    interactionName: string;
    cost: { min: number; max: number };
  }>;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ totalCost, results }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Use max of cost.max for scaling bars
  const maxCost = Math.max(...results.map(r => r.cost.max));

  return (
    <div
      className="rounded-lg shadow-md p-6 mb-6"
      style={{ background: theme.summaryBg }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: theme.summaryText }}>Cost Summary</h2>
      
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm" style={{ color: theme.summaryText, opacity: 0.7 }}>Estimated Monthly Cost</p>
          <p className="text-3xl font-bold" style={{ color: theme.summaryAccent }}>
            {totalCost.min === totalCost.max
              ? formatCurrency(totalCost.min)
              : `${formatCurrency(totalCost.min)} - ${formatCurrency(totalCost.max)}`}
          </p>
        </div>
        
        <div className="p-4 rounded-lg shadow-sm max-w-md" style={{ background: theme.white }}>
          <div className="flex items-start">
            <FaInfoCircle className="mt-1 mr-2 flex-shrink-0" style={{ color: theme.summaryAccent }} />
            <div>
              <p className="text-sm" style={{ color: theme.summaryText, opacity: 0.7 }}>
                This estimate is based on current model pricing and your configured usage patterns. 
                Actual costs may vary based on real-world usage and any pricing changes from providers.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Cost Breakdown Bar Chart */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2" style={{ color: theme.summaryText }}>Cost Breakdown</h3>
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.interactionName} className="flex items-center">
              <span className="w-48 truncate text-sm font-medium" style={{ color: theme.summaryText }}>{r.interactionName}</span>
              <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2 relative">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${maxCost > 0 ? (r.cost.max / maxCost) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-medium ml-2" style={{ minWidth: 60, color: theme.summaryText }}>
                {r.cost.min === r.cost.max
                  ? formatCurrency(r.cost.max)
                  : `${formatCurrency(r.cost.min)} - ${formatCurrency(r.cost.max)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
