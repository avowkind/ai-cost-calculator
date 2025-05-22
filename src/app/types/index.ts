export interface ModelProvider {
  id: string;
  name: string;
  models: Model[];
}

export interface Model {
  id: string;
  name: string;
  inputCost: number; // Cost per 1K tokens
  outputCost: number; // Cost per 1K tokens
  perImageCost?: number; // Cost per image (for image generation models like DALL-E, gpt-image-1)
}

export interface Interaction {
  id: string;
  name: string;
  description: string;
  defaultModel: string;
  audience: 'user' | 'admin' | 'both';
  usage: {
    requestType: 'daily' | 'monthly';
    defaultRequests: number;
    defaultActiveUsers: number;
  };
  tokens: {
    base?: number;
    input: {
      min: number;
      max: number;
    };
    output: {
      min: number;
      max: number;
    };
  };
}

export interface CalculationSettings {
  adminCount: number;
  userCount: number;
  daysPerMonth: number;
  selectedGlobalModel: string;
  interactionSettings: {
    [key: string]: {
      selectedModel: string;
      requests: number;
      activeUsers: number;
      enabled?: boolean;
      useSystemUserCount?: boolean;
      useSystemAdminCount?: boolean;
      activeUsersMode?: 'admin' | 'user' | 'custom';
      tokens?: {
        base?: number;
        input: { min: number; max: number };
        output: { min: number; max: number };
      };
    };
  };
}

export interface CostResult {
  interactionId: string;
  interactionName: string;
  modelName: string;
  monthlyRequestCount: number;
  inputTokens: {
    min: number;
    max: number;
  };
  outputTokens: {
    min: number;
    max: number;
  };
  cost: {
    min: number;
    max: number;
  };
}
