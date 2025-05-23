'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GlobalSettings from './components/GlobalSettings';
import InteractionPanel from './components/InteractionPanel';
import ResultsTable from './components/ResultsTable';
import SummaryPanel from './components/SummaryPanel';
import { modelProviders, interactions, getDefaultSettings } from './lib/data';
import { calculateCosts, calculateTotalCost } from './lib/utils';
import { handleExport, exportSettingsToJSON } from './lib/export';
import { CalculationSettings, CostResult } from './types';

export default function Home() {
  const [settings, setSettings] = useState<CalculationSettings>(getDefaultSettings());
  const [results, setResults] = useState<CostResult[]>([]);
  const [totalCost, setTotalCost] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiCostCalculatorSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Calculate costs whenever settings change
  useEffect(() => {
    try {
      const newResults = calculateCosts(settings);
      setResults(newResults);
      setTotalCost(calculateTotalCost(newResults));
      
      // Save settings to localStorage
      localStorage.setItem('aiCostCalculatorSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error calculating costs:', error);
    }
  }, [settings]);

  // Handle global settings changes
  const handleAdminCountChange = (value: number) => {
    setSettings(prev => ({ ...prev, adminCount: value }));
  };

  const handleUserCountChange = (value: number) => {
    setSettings(prev => {
      const newSettings = { ...prev, userCount: value };
      
      // Update Goal Generator active users to match user count
      if (newSettings.interactionSettings['goal-generator']) {
        newSettings.interactionSettings['goal-generator'].activeUsers = value;
      }
      
      return newSettings;
    });
  };

  const handleDaysPerMonthChange = (value: number) => {
    setSettings(prev => ({ ...prev, daysPerMonth: value }));
  };

  const handleGlobalModelChange = (modelId: string) => {
    setSettings(prev => ({ ...prev, selectedGlobalModel: modelId }));
  };

  // Handle interaction-specific settings changes
  const handleInteractionModelChange = (interactionId: string, modelId: string) => {
    setSettings(prev => ({
      ...prev,
      interactionSettings: {
        ...prev.interactionSettings,
        [interactionId]: {
          ...prev.interactionSettings[interactionId],
          selectedModel: modelId
        }
      }
    }));
  };

  const handleInteractionRequestsChange = (interactionId: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      interactionSettings: {
        ...prev.interactionSettings,
        [interactionId]: {
          ...prev.interactionSettings[interactionId],
          requests: value
        }
      }
    }));
  };

  const handleInteractionActiveUsersChange = (interactionId: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      interactionSettings: {
        ...prev.interactionSettings,
        [interactionId]: {
          ...prev.interactionSettings[interactionId],
          activeUsers: value,
          useSystemUserCount: false,
          useSystemAdminCount: false
        }
      }
    }));
  };

  const handleInteractionActiveUsersModeChange = (interactionId: string, mode: 'admin' | 'user' | 'custom') => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const interactionSetting = newSettings.interactionSettings[interactionId];
      interactionSetting.activeUsersMode = mode;
      if (mode === 'admin') {
        interactionSetting.activeUsers = newSettings.adminCount;
      } else if (mode === 'user') {
        interactionSetting.activeUsers = newSettings.userCount;
      }
      // For 'custom', do not change activeUsers
      return newSettings;
    });
  };


  // Handle token range changes for input/output
  const handleInteractionTokensChange = (
    interactionId: string,
    type: 'input' | 'output' | 'base',
    minOrBase: number,
    max?: number
  ) => {
    setSettings(prev => {
      const originalTokens = interactions.find(i => i.id === interactionId)?.tokens;
      const prevTokens = prev.interactionSettings[interactionId]?.tokens as Partial<{
        base: number;
        input: { min: number; max: number };
        output: { min: number; max: number };
      }> || {};
      if (type === 'base') {
        return {
          ...prev,
          interactionSettings: {
            ...prev.interactionSettings,
            [interactionId]: {
              ...prev.interactionSettings[interactionId],
              tokens: {
                ...prevTokens,
                base: minOrBase,
                input: prevTokens.input || originalTokens?.input || { min: 0, max: 0 },
                output: prevTokens.output || originalTokens?.output || { min: 0, max: 0 },
              },
            },
          },
        };
      } else {
        return {
          ...prev,
          interactionSettings: {
            ...prev.interactionSettings,
            [interactionId]: {
              ...prev.interactionSettings[interactionId],
              tokens: {
                base: prevTokens.base ?? originalTokens?.base,
                input: type === 'input'
                  ? { min: minOrBase, max: max! }
                  : prevTokens.input || originalTokens?.input || { min: 0, max: 0 },
                output: type === 'output'
                  ? { min: minOrBase, max: max! }
                  : prevTokens.output || originalTokens?.output || { min: 0, max: 0 },
              },
            },
          },
        };
      }
    });
  };

  // Handle export
  const handleExportResults = () => {
    handleExport(results, 'csv');
  };

  // Handle reset to defaults
  const handleReset = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    localStorage.setItem('aiCostCalculatorSettings', JSON.stringify(defaults));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onExportSettings={exportSettingsToJSON} onExportResults={handleExportResults} onReset={handleReset} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-2/3">
            <SummaryPanel totalCost={totalCost} results={results.map(r => ({ interactionName: r.interactionName, cost: r.cost }))} />
          </div>
          <div className="w-full md:w-1/3">
            <GlobalSettings
              adminCount={settings.adminCount}
              userCount={settings.userCount}
              daysPerMonth={settings.daysPerMonth}
              selectedGlobalModel={settings.selectedGlobalModel}
              modelProviders={modelProviders}
              onAdminCountChange={handleAdminCountChange}
              onUserCountChange={handleUserCountChange}
              onDaysPerMonthChange={handleDaysPerMonthChange}
              onGlobalModelChange={handleGlobalModelChange}
            />
          </div>
        </div>
        <ResultsTable results={results} />
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Interactions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interactions.map(interaction => {
              // Get tokens from settings or fall back to interaction.tokens
              const tokens = settings.interactionSettings[interaction.id]?.tokens || interaction.tokens;
              const enabled = settings.interactionSettings[interaction.id]?.enabled !== false;
              const activeUsersMode = settings.interactionSettings[interaction.id]?.activeUsersMode || (interaction.audience === 'admin' ? 'admin' : 'user');
              let activeUsers = settings.interactionSettings[interaction.id]?.activeUsers || 0;
              if (activeUsersMode === 'admin') {
                activeUsers = settings.adminCount;
              } else if (activeUsersMode === 'user') {
                activeUsers = settings.userCount;
              }

              // Find the global model name for display
              const globalModelId = settings.selectedGlobalModel;
              const globalModelObj = (Array.isArray(modelProviders) ? modelProviders : [])
                .flatMap(provider =>
                  Array.isArray(provider.models)
                    ? provider.models.map(model => ({
                        id: model.id,
                        name: `${provider.name} - ${model.name}`
                      }))
                    : []
                )
                .find(model => model.id === globalModelId);
              const globalModelName = globalModelObj ? globalModelObj.name : 'undefined';

              // Determine selected model: default if not set
              const selectedModel = settings.interactionSettings[interaction.id]?.selectedModel ?? 'default';

              return (
                <InteractionPanel
                  key={interaction.id}
                  interaction={interaction}
                  modelProviders={modelProviders}
                  selectedModel={selectedModel}
                  globalModelName={globalModelName}
                  requests={settings.interactionSettings[interaction.id]?.requests || 0}
                  activeUsers={activeUsers}
                  tokens={tokens}
                  enabled={enabled}
                  activeUsersMode={activeUsersMode}
                  onToggleEnabled={() => setSettings(prev => ({
                    ...prev,
                    interactionSettings: {
                      ...prev.interactionSettings,
                      [interaction.id]: {
                        ...prev.interactionSettings[interaction.id],
                        enabled: !enabled
                      }
                    }
                  }))}
                  onModelChange={(modelId) => handleInteractionModelChange(interaction.id, modelId)}
                  onRequestsChange={(value) => handleInteractionRequestsChange(interaction.id, value)}
                  onActiveUsersChange={(value) => handleInteractionActiveUsersChange(interaction.id, value)}
                  onActiveUsersModeChange={(mode) => handleInteractionActiveUsersModeChange(interaction.id, mode)}
                  onTokensChange={handleInteractionTokensChange}
                />
              );
            })}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Totara LMS AI Cost Calculator</p>
          <p className="text-sm mt-2 text-gray-400">
            Pricing data is approximate and subject to change. Always verify with the model provider.
          </p>
        </div>
      </footer>
    </div>
  );
}
