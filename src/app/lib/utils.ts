import { CalculationSettings, CostResult } from '../types';
import { findModelById, interactions } from './data';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const calculateCosts = (settings: CalculationSettings): CostResult[] => {
  return interactions
    .filter(interaction => settings.interactionSettings[interaction.id]?.enabled !== false)
    .map(interaction => {
      const interactionSettings = settings.interactionSettings[interaction.id];
      let modelId = interactionSettings.selectedModel || settings.selectedGlobalModel;
      if (modelId === 'default') {
        modelId = settings.selectedGlobalModel;
      }
      const modelInfo = findModelById(modelId);
      
      if (!modelInfo) {
        throw new Error(`Model ${modelId} not found`);
      }
      
      const { model } = modelInfo;
      
      // Calculate monthly requests based on daily or monthly frequency
      const monthlyRequests = interaction.usage.requestType === 'daily'
        ? interactionSettings.requests * settings.daysPerMonth
        : interactionSettings.requests;
      
      // Calculate total active users based on mode
      let totalActiveUsers: number;
      if (interactionSettings.activeUsersMode === 'admin') {
        totalActiveUsers = settings.adminCount;
      } else if (interactionSettings.activeUsersMode === 'user') {
        totalActiveUsers = settings.userCount;
      } else {
        totalActiveUsers = interactionSettings.activeUsers;
      }
      
      // Calculate base tokens if present
      const baseTokens = interaction.tokens.base || 0;
      
      // Calculate min and max input tokens
      const minInputTokens = (baseTokens + interaction.tokens.input.min) * monthlyRequests * totalActiveUsers;
      const maxInputTokens = (baseTokens + interaction.tokens.input.max) * monthlyRequests * totalActiveUsers;
      
      // Calculate min and max output tokens
      const minOutputTokens = interaction.tokens.output.min * monthlyRequests * totalActiveUsers;
      const maxOutputTokens = interaction.tokens.output.max * monthlyRequests * totalActiveUsers;
      
      // Calculate min and max costs (convert from per 1K tokens to per token)
      let minCost, maxCost;
      if (typeof model.perImageCost === 'number' && model.perImageCost > 0) {
        // For image generation models, cost is per image
        minCost = maxCost = monthlyRequests * totalActiveUsers * model.perImageCost;
      } else {
        minCost = (minInputTokens * model.inputCost / 1000) + (minOutputTokens * model.outputCost / 1000);
        maxCost = (maxInputTokens * model.inputCost / 1000) + (maxOutputTokens * model.outputCost / 1000);
      }
      
      return {
        interactionId: interaction.id,
        interactionName: interaction.name,
        modelName: model.name,
        monthlyRequestCount: monthlyRequests * totalActiveUsers,
        inputTokens: {
          min: minInputTokens,
          max: maxInputTokens
        },
        outputTokens: {
          min: minOutputTokens,
          max: maxOutputTokens
        },
        cost: {
          min: minCost,
          max: maxCost
        }
      };
    });
};

export const calculateTotalCost = (results: CostResult[]): { min: number; max: number } => {
  return results.reduce(
    (total, result) => ({
      min: total.min + result.cost.min,
      max: total.max + result.cost.max
    }),
    { min: 0, max: 0 }
  );
};
