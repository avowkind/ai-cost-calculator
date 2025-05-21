import React from 'react';
import { Interaction, ModelProvider } from '../types';

interface InteractionPanelProps {
  interaction: Interaction;
  modelProviders: ModelProvider[];
  selectedModel: string;
  requests: number;
  activeUsers: number;
  onModelChange: (modelId: string) => void;
  onRequestsChange: (value: number) => void;
  onActiveUsersChange: (value: number) => void;
}

const InteractionPanel: React.FC<InteractionPanelProps> = ({
  interaction,
  modelProviders,
  selectedModel,
  requests,
  activeUsers,
  onModelChange,
  onRequestsChange,
  onActiveUsersChange
}) => {
  // Flatten all models from all providers for the dropdown
  const allModels = modelProviders.flatMap(provider => 
    provider.models.map(model => ({
      id: model.id,
      name: `${provider.name} - ${model.name}`
    }))
  );

  // For image generation, filter to only show image models
  const availableModels = interaction.id === 'image-generation'
    ? allModels.filter(model => model.id === 'gpt-image-1')
    : allModels;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{interaction.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{interaction.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor={`model-${interaction.id}`} className="block text-sm font-medium text-gray-700">
            AI Model
          </label>
          <select
            id={`model-${interaction.id}`}
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`requests-${interaction.id}`} className="block text-sm font-medium text-gray-700">
            {interaction.usage.requestType === 'daily' ? 'Daily' : 'Monthly'} Requests
          </label>
          <input
            type="number"
            id={`requests-${interaction.id}`}
            min="0"
            value={requests}
            onChange={(e) => onRequestsChange(parseInt(e.target.value) || 0)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`users-${interaction.id}`} className="block text-sm font-medium text-gray-700">
            {interaction.id === 'goal-generator' ? 'Uses System User Count' : 'Active Users'}
          </label>
          <input
            type="number"
            id={`users-${interaction.id}`}
            min="1"
            value={activeUsers}
            onChange={(e) => onActiveUsersChange(parseInt(e.target.value) || 1)}
            disabled={interaction.id === 'goal-generator'}
            className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              interaction.id === 'goal-generator' ? 'bg-gray-100' : ''
            }`}
          />
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-gray-700">Input Tokens</h4>
          <p className="text-sm text-gray-600">
            {interaction.tokens.base ? `Base: ${interaction.tokens.base} + ` : ''}
            Range: {interaction.tokens.input.min} - {interaction.tokens.input.max}
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-gray-700">Output Tokens</h4>
          <p className="text-sm text-gray-600">
            Range: {interaction.tokens.output.min} - {interaction.tokens.output.max}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionPanel;
