import React, { useState } from 'react';
import { Interaction, ModelProvider } from '../types';
import { theme } from '../theme';

interface InteractionPanelProps {
  interaction: Interaction;
  modelProviders: ModelProvider[];
  selectedModel: string;
  requests: number;
  activeUsers: number;
  tokens: {
    input: { min: number; max: number };
    output: { min: number; max: number };
    base?: number;
  };
  enabled: boolean;
  activeUsersMode: 'admin' | 'user' | 'custom';
  onToggleEnabled: () => void;
  onModelChange: (modelId: string) => void;
  onRequestsChange: (value: number) => void;
  onActiveUsersChange: (value: number) => void;
  onActiveUsersModeChange: (mode: 'admin' | 'user' | 'custom') => void;
  onTokensChange: (
    interactionId: string,
    type: 'input' | 'output' | 'base',
    minOrBase: number,
    max?: number
  ) => void;
}

const InteractionPanel: React.FC<InteractionPanelProps> = ({
  interaction,
  modelProviders,
  selectedModel,
  requests,
  activeUsers,
  tokens,
  enabled,
  activeUsersMode,
  onToggleEnabled,
  onModelChange,
  onRequestsChange,
  onActiveUsersChange,
  onActiveUsersModeChange,
  onTokensChange
}) => {
  const [editType, setEditType] = useState<null | 'input' | 'output' | 'base'>(null);
  const [editValues, setEditValues] = useState<{ min: number; max: number; base: number }>({ min: 0, max: 0, base: 0 });

  // Flatten all models from all providers for the dropdown
  const allModels = modelProviders.flatMap(provider => 
    provider.models.map(model => ({
      id: model.id,
      name: `${provider.name} - ${model.name}`,
      perImageCost: model.perImageCost
    }))
  );

  // For image generation, filter to only show image models
  const availableModels = interaction.id === 'image-generation'
    ? allModels.filter(model => typeof model.perImageCost === 'number' && model.perImageCost > 0)
    : allModels;

  // Defensive fallback for tokens
  const safeInput = tokens.input || { min: 0, max: 0 };
  const safeOutput = tokens.output || { min: 0, max: 0 };

  // Determine which count is being used
  const isUsingSystem = activeUsersMode === 'admin' || activeUsersMode === 'user';

  // Handlers for editing tokens
  const handleEditClick = (type: 'input' | 'output' | 'base') => {
    setEditType(type);
    setEditValues({
      min: tokens.input?.min ?? 0,
      max: tokens.input?.max ?? 0,
      base: typeof tokens.base === 'number' ? tokens.base : 0
    });
  };

  const handleEditChange = (field: 'min' | 'max' | 'base', value: number) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleEditBlurOrEnter = (type: 'input' | 'output' | 'base') => {
    if (type === 'base') {
      onTokensChange(interaction.id, 'base', editValues.base);
    } else {
      onTokensChange(interaction.id, type, editValues.min, editValues.max);
    }
    setEditType(null);
  };

  return (
    <div className={`rounded-lg shadow-md mb-4 bg-white`}>
      <div className={`flex items-center justify-between rounded-t-lg px-5 py-3 transition-opacity ${enabled ? '' : 'opacity-60'}`}
        style={{ backgroundColor: theme.primary }}>
        <div>
          <h3 className="text-lg font-semibold text-white">{interaction.name}</h3>
          <p className="text-sm" style={{ color: theme.textOnPrimary, opacity: 0.85 }}>{interaction.description}</p>
        </div>
        <label className="flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggleEnabled}
            className="sr-only"
          />
          <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${enabled ? '' : ''}`}
            style={{ backgroundColor: enabled ? theme.primaryDark : theme.primaryLight }}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-5' : ''}`}></div>
          </div>
        </label>
      </div>
      <div className={`p-5 transition-opacity ${enabled ? '' : 'opacity-60 pointer-events-none'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor={`model-${interaction.id}`} className="block text-sm font-medium text-gray-700">
              AI Model
            </label>
            <select
              id={`model-${interaction.id}`}
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-[42px]"
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
              Active Users
            </label>
            <div className="flex flex-col items-start gap-0">
              <input
                type="number"
                id={`users-${interaction.id}`}
                min="1"
                value={activeUsers}
                onChange={(e) => onActiveUsersChange(parseInt(e.target.value) || 1)}
                disabled={isUsingSystem}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  isUsingSystem ? 'bg-gray-100' : ''
                }`}
              />
              <div className="flex flex-row items-center gap-2 mt-2">
                <label className="flex items-center text-xs cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`activeUsersMode-${interaction.id}`}
                    checked={activeUsersMode === 'admin'}
                    onChange={() => onActiveUsersModeChange('admin')}
                    className="mr-1"
                  />
                  Admin
                </label>
                <label className="flex items-center text-xs cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`activeUsersMode-${interaction.id}`}
                    checked={activeUsersMode === 'user'}
                    onChange={() => onActiveUsersModeChange('user')}
                    className="mr-1"
                  />
                  User
                </label>
                <label className="flex items-center text-xs cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`activeUsersMode-${interaction.id}`}
                    checked={activeUsersMode === 'custom'}
                    onChange={() => onActiveUsersModeChange('custom')}
                    className="mr-1"
                  />
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-700">Instruction Tokens</h4>
            {editType === 'base' ? (
              <div className="flex items-center mt-1" tabIndex={-1}
                onBlur={e => {
                  const related = e.relatedTarget as HTMLElement | null;
                  if (!related || (related.tagName !== 'INPUT')) {
                    handleEditBlurOrEnter('base');
                  }
                }}
              >
                <input
                  type="number"
                  className="w-20 px-1 py-0.5 border border-gray-300 rounded"
                  value={editValues.base}
                  onChange={e => handleEditChange('base', parseInt(e.target.value) || 0)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEditBlurOrEnter('base'); }}
                  autoFocus
                />
              </div>
            ) : (
              <p
                className="text-sm text-gray-600 mt-1 cursor-pointer hover:bg-gray-200 rounded px-1 inline-block"
                onClick={() => handleEditClick('base')}
                title="Click to edit base tokens"
              >
                {typeof tokens.base === 'number' ? tokens.base : 0}
              </p>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded-md md:col-span-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Input Tokens</h4>
            </div>
            {editType === 'input' ? (
              <div
                className="flex items-center space-x-2 mt-1"
                tabIndex={-1}
                onBlur={e => {
                  const related = e.relatedTarget as HTMLElement | null;
                  if (!related || (related.tagName !== 'INPUT')) {
                    handleEditBlurOrEnter('input');
                  }
                }}
              >
                <input
                  type="number"
                  className="w-16 px-1 py-0.5 border border-gray-300 rounded"
                  value={editValues.min}
                  onChange={e => handleEditChange('min', parseInt(e.target.value) || 0)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEditBlurOrEnter('input'); }}
                  autoFocus
                />
                <span>-</span>
                <input
                  type="number"
                  className="w-16 px-1 py-0.5 border border-gray-300 rounded"
                  value={editValues.max}
                  onChange={e => handleEditChange('max', parseInt(e.target.value) || 0)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEditBlurOrEnter('input'); }}
                />
              </div>
            ) : (
              <p
                className="text-sm text-gray-600 mt-1 cursor-pointer hover:bg-gray-200 rounded px-1 inline-block"
                onClick={() => handleEditClick('input')}
                title="Click to edit input token range"
              >
                Range: {safeInput.min} - {safeInput.max}
              </p>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded-md md:col-span-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Output Tokens</h4>
            </div>
            {editType === 'output' ? (
              <div
                className="flex items-center space-x-2 mt-1"
                tabIndex={-1}
                onBlur={e => {
                  const related = e.relatedTarget as HTMLElement | null;
                  if (!related || (related.tagName !== 'INPUT')) {
                    handleEditBlurOrEnter('output');
                  }
                }}
              >
                <input
                  type="number"
                  className="w-16 px-1 py-0.5 border border-gray-300 rounded"
                  value={editValues.min}
                  onChange={e => handleEditChange('min', parseInt(e.target.value) || 0)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEditBlurOrEnter('output'); }}
                  autoFocus
                />
                <span>-</span>
                <input
                  type="number"
                  className="w-16 px-1 py-0.5 border border-gray-300 rounded"
                  value={editValues.max}
                  onChange={e => handleEditChange('max', parseInt(e.target.value) || 0)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEditBlurOrEnter('output'); }}
                />
              </div>
            ) : (
              <p
                className="text-sm text-gray-600 mt-1 cursor-pointer hover:bg-gray-200 rounded px-1 inline-block"
                onClick={() => handleEditClick('output')}
                title="Click to edit output token range"
              >
                Range: {safeOutput.min} - {safeOutput.max}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionPanel;
