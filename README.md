# Totara LMS AI Cost Calculator

A comprehensive dashboard for Totara LMS administrators to evaluate the costs of AI model usage across different features and interactions.

## Features

- Calculate estimated costs for AI interactions in Totara LMS
- Support for multiple model providers (OpenAI, Anthropic, AWS Bedrock/Mistral)
- Global settings for admin count, user count, and working days per month
- Per-interaction model selection and usage configuration
- Cost calculation with lower and upper bounds based on token ranges
- Export results to CSV format
- Persistent settings via local storage
- Responsive design for all devices

## AI Interactions Supported

- Generate Content (Weka Editor AI Assistant)
- Summarise Content (Weka Editor AI Assistant)
- Summarise File Content (Weka Editor AI Assistant)
- Localise Text (Weka Editor AI Assistant)
- Image Generation
- Knowledge Check-in Generator
- Goal Generator

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/totara-ai-cost-calculator.git
cd totara-ai-cost-calculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Deploy with default settings

### Static Export

You can also create a static build:

```bash
npm run build
# or
yarn build
```

## Usage

1. Set global parameters (admin count, user count, working days)
2. Select a default AI model or customize per interaction
3. Adjust usage parameters for each interaction
4. View the calculated costs in the results table
5. Export results as needed

## Project Structure

- `src/app/components/` - React components for the UI
- `src/app/lib/` - Utility functions and data
- `src/app/types/` - TypeScript type definitions
- `src/app/page.tsx` - Main application page

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- jsPDF (for PDF export)
- Recharts (for data visualization)

## License

This project is licensed under the MIT License.
