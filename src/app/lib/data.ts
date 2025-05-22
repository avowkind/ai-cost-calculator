import modelProvidersJson from './modelProviders.json';
import interactionsJson from './interactions.json';
import { ModelProvider, Interaction } from '../types';
const modelProviders = modelProvidersJson as ModelProvider[];
const interactions = interactionsJson as Interaction[];
export { modelProviders, interactions };

export const getDefaultSettings = () => {
  const interactionSettings: Record<string, { selectedModel: string; requests: number; activeUsers: number; enabled: boolean; useSystemUserCount?: boolean; useSystemAdminCount?: boolean; activeUsersMode: 'admin' | 'user' | 'custom' }> = {};
  
  interactions.forEach(interaction => {
    interactionSettings[interaction.id] = {
      selectedModel: interaction.defaultModel,
      requests: interaction.usage.defaultRequests,
      activeUsers: interaction.usage.defaultActiveUsers,
      enabled: true,
      ...(interaction.audience === 'user' || interaction.audience === 'both' ? { useSystemUserCount: true } : {}),
      ...(interaction.audience === 'admin' ? { useSystemAdminCount: true } : {}),
      activeUsersMode: interaction.audience === 'admin' ? 'admin' as const : 'user' as const
    };
  });
  
  return {
    adminCount: 4,
    userCount: 1000,
    daysPerMonth: 22,
    selectedGlobalModel: 'gpt-4o',
    interactionSettings
  };
};

export const findModelById = (modelId: string) => {
  for (const provider of modelProviders) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) {
      return { provider, model };
    }
  }
  return null;
};
