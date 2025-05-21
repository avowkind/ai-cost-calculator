import { Interaction, ModelProvider } from '../types';

export const modelProviders: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        inputCost: 0.01, // $10 per 1M tokens
        outputCost: 0.03, // $30 per 1M tokens
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        inputCost: 0.01, // $10 per 1M tokens
        outputCost: 0.03, // $30 per 1M tokens
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        inputCost: 0.0005, // $0.50 per 1M tokens
        outputCost: 0.0015, // $1.50 per 1M tokens
      },
      {
        id: 'gpt-image-1',
        name: 'DALL-E 3',
        inputCost: 0.04, // $40 per 1M tokens (image generation)
        outputCost: 0, // No output token cost for image generation
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        inputCost: 0.015, // $15 per 1M tokens
        outputCost: 0.075, // $75 per 1M tokens
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        inputCost: 0.003, // $3 per 1M tokens
        outputCost: 0.015, // $15 per 1M tokens
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        inputCost: 0.00025, // $0.25 per 1M tokens
        outputCost: 0.00125, // $1.25 per 1M tokens
      }
    ]
  },
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    models: [
      {
        id: 'mistral-large',
        name: 'Mistral Large',
        inputCost: 0.008, // $8 per 1M tokens
        outputCost: 0.024, // $24 per 1M tokens
      },
      {
        id: 'mistral-small',
        name: 'Mistral Small',
        inputCost: 0.002, // $2 per 1M tokens
        outputCost: 0.006, // $6 per 1M tokens
      }
    ]
  }
];

export const interactions: Interaction[] = [
  {
    id: 'generate-content',
    name: 'Generate Content',
    description: 'Generate new content from a prompt in the Weka Editor AI Assistant',
    defaultModel: 'gpt-4o',
    usage: {
      requestType: 'daily',
      defaultRequests: 40,
      defaultActiveUsers: 4
    },
    tokens: {
      input: {
        min: 120,
        max: 120
      },
      output: {
        min: 800,
        max: 1600
      }
    }
  },
  {
    id: 'summarize-content',
    name: 'Summarise Content',
    description: 'Summarize existing content in the Weka Editor AI Assistant',
    defaultModel: 'gpt-4o',
    usage: {
      requestType: 'daily',
      defaultRequests: 40,
      defaultActiveUsers: 4
    },
    tokens: {
      base: 50,
      input: {
        min: 1400,
        max: 2800
      },
      output: {
        min: 120,
        max: 200
      }
    }
  },
  {
    id: 'summarize-file',
    name: 'Summarise File Content',
    description: 'Summarize uploaded file content in the Weka Editor AI Assistant',
    defaultModel: 'gpt-4o',
    usage: {
      requestType: 'daily',
      defaultRequests: 5,
      defaultActiveUsers: 4
    },
    tokens: {
      input: {
        min: 5000,
        max: 15000
      },
      output: {
        min: 500,
        max: 1000
      }
    }
  },
  {
    id: 'localize-text',
    name: 'Localise Text',
    description: 'Translate custom elements within a Totara installation',
    defaultModel: 'gpt-4o',
    usage: {
      requestType: 'monthly',
      defaultRequests: 100,
      defaultActiveUsers: 4
    },
    tokens: {
      base: 200,
      input: {
        min: 120,
        max: 800
      },
      output: {
        min: 800,
        max: 4000
      }
    }
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Generate images from text prompts',
    defaultModel: 'gpt-image-1',
    usage: {
      requestType: 'monthly',
      defaultRequests: 100,
      defaultActiveUsers: 4
    },
    tokens: {
      input: {
        min: 120,
        max: 800
      },
      output: {
        min: 0,
        max: 0
      }
    }
  },
  {
    id: 'knowledge-checkin',
    name: 'Knowledge Check-in Generator',
    description: 'Generate quizzes from content for reinforcement learning',
    defaultModel: 'gpt-4o',
    usage: {
      requestType: 'monthly',
      defaultRequests: 5,
      defaultActiveUsers: 4
    },
    tokens: {
      input: {
        min: 5000,
        max: 10000
      },
      output: {
        min: 3000,
        max: 3000
      }
    }
  },
  {
    id: 'goal-generator',
    name: 'Goal Generator',
    description: 'Generate SMART goals from user responses',
    defaultModel: 'gpt-4o',
    usage: {
      requestType: 'monthly',
      defaultRequests: 5,
      defaultActiveUsers: 1000
    },
    tokens: {
      input: {
        min: 500,
        max: 500
      },
      output: {
        min: 200,
        max: 200
      }
    }
  }
];

export const getDefaultSettings = () => {
  const interactionSettings: Record<string, { selectedModel: string; requests: number; activeUsers: number }> = {};
  
  interactions.forEach(interaction => {
    interactionSettings[interaction.id] = {
      selectedModel: interaction.defaultModel,
      requests: interaction.usage.defaultRequests,
      activeUsers: interaction.usage.defaultActiveUsers
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
