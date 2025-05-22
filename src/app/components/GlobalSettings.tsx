import React from 'react';
import { ModelProvider } from '../types';

interface GlobalSettingsProps {
  adminCount: number;
  userCount: number;
  daysPerMonth: number;
  selectedGlobalModel: string;
  modelProviders: ModelProvider[];
  onAdminCountChange: (value: number) => void;
  onUserCountChange: (value: number) => void;
  onDaysPerMonthChange: (value: number) => void;
  onGlobalModelChange: (modelId: string) => void;
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({
  adminCount,
  userCount,
  daysPerMonth,
  selectedGlobalModel,
  modelProviders,
  onAdminCountChange,
  onUserCountChange,
  onDaysPerMonthChange,
  onGlobalModelChange
}) => {
  // Flatten all models from all providers for the dropdown
  const allModels = modelProviders.flatMap(provider => 
    provider.models.map(model => ({
      id: model.id,
      name: `${provider.name} - ${model.name}`
    }))
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Global Settings</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="adminCount" className="block text-sm font-medium text-gray-700">
            Admin Count
          </label>
          <input
            type="number"
            id="adminCount"
            min="1"
            value={adminCount}
            onChange={(e) => onAdminCountChange(parseInt(e.target.value) || 1)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="userCount" className="block text-sm font-medium text-gray-700">
            User Count
          </label>
          <input
            type="number"
            id="userCount"
            min="1"
            value={userCount}
            onChange={(e) => onUserCountChange(parseInt(e.target.value) || 1)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="daysPerMonth" className="block text-sm font-medium text-gray-700">
            Working Days per Month
          </label>
          <input
            type="number"
            id="daysPerMonth"
            min="1"
            max="31"
            value={daysPerMonth}
            onChange={(e) => onDaysPerMonthChange(parseInt(e.target.value) || 22)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="globalModel" className="block text-sm font-medium text-gray-700">
            Default AI Model
          </label>
          <select
            id="globalModel"
            value={selectedGlobalModel}
            onChange={(e) => onGlobalModelChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {allModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-500">
        These settings will be applied globally across all interactions unless overridden.
      </p>
    </div>
  );
};

export default GlobalSettings;
