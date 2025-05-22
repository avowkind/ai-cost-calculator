import React from 'react';
import { CostResult } from '../types';
import { formatCurrency } from '../lib/utils';

interface ResultsTableProps {
  results: CostResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const totalCost = results.reduce(
    (total, result) => ({
      min: total.min + result.cost.min,
      max: total.max + result.cost.max
    }),
    { min: 0, max: 0 }
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cost Calculation Results</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interaction
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Requests
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Input Tokens
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Output Tokens
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.interactionId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.interactionName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.modelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.monthlyRequestCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.inputTokens.min === result.inputTokens.max
                    ? result.inputTokens.min.toLocaleString()
                    : `${result.inputTokens.min.toLocaleString()} - ${result.inputTokens.max.toLocaleString()}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.outputTokens.min === result.outputTokens.max
                    ? result.outputTokens.min.toLocaleString()
                    : `${result.outputTokens.min.toLocaleString()} - ${result.outputTokens.max.toLocaleString()}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {result.cost.min === result.cost.max
                    ? formatCurrency(result.cost.min)
                    : `${formatCurrency(result.cost.min)} - ${formatCurrency(result.cost.max)}`}
                </td>
              </tr>
            ))}
            
            {/* Total row */}
            <tr className="bg-gray-50">
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                Total Monthly Cost:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {totalCost.min === totalCost.max
                  ? formatCurrency(totalCost.min)
                  : `${formatCurrency(totalCost.min)} - ${formatCurrency(totalCost.max)}`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
