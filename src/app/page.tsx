'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GlobalSettings from './components/GlobalSettings';
import InteractionPanel from './components/InteractionPanel';
import ResultsTable from './components/ResultsTable';
import SummaryPanel from './components/SummaryPanel';
import { modelProviders, interactions, getDefaultSettings } from './lib/data';
import { calculateCosts, calculateTotalCost } from './lib/utils';
import { handleExport } from './lib/export';
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
          activeUsers: value
        }
      }
    }));
  };

  // Handle export
  const handleExportResults = () => {
    handleExport(results, 'csv');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
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
        
        <SummaryPanel totalCost={totalCost} />
        
        <ResultsTable results={results} onExport={handleExportResults} />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Interactions</h2>
          
          {interactions.map(interaction => (
            <InteractionPanel
              key={interaction.id}
              interaction={interaction}
              modelProviders={modelProviders}
              selectedModel={
                settings.interactionSettings[interaction.id]?.selectedModel || 
                settings.selectedGlobalModel
              }
              requests={settings.interactionSettings[interaction.id]?.requests || 0}
              activeUsers={
                interaction.id === 'goal-generator'
                  ? settings.userCount
                  : settings.interactionSettings[interaction.id]?.activeUsers || 0
              }
              onModelChange={(modelId) => handleInteractionModelChange(interaction.id, modelId)}
              onRequestsChange={(value) => handleInteractionRequestsChange(interaction.id, value)}
              onActiveUsersChange={(value) => handleInteractionActiveUsersChange(interaction.id, value)}
            />
          ))}
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
