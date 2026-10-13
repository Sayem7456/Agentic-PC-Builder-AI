# Agentic PC Builder AI

An AI-powered PC configuration generator that recommends optimized hardware based on a user's workload, budget, and region. It supports five primary use cases:

- Gaming
- Video Editing
- Software Development
- AI Research
- CAD

The app uses Gemini to generate compatible component recommendations with realistic regional pricing and purchase links.

## Features

- Budget-aware PC recommendations
- Region-specific pricing and retailer links
- Compatibility checking for core hardware combinations
- Use-case optimized builds for gaming, creative work, development, AI research, and CAD
- Clean React + Vite frontend

## Tech Stack

- React
- TypeScript
- Vite
- Google Gemini API

## Supported Use Cases

- Gaming: prioritizes GPU performance, CPU balance, and adequate RAM
- Video Editing: favors CPU power, storage speed, and efficient color workflow support
- Software Development: balances core count, memory, and system responsiveness
- AI Research: emphasizes strong CPU/GPU balance and memory capacity
- CAD: focuses on workstation-class CPU, GPU, and stable performance for modeling workloads

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A Gemini API key

### 1) Install dependencies

```bash
npm install
```

### 2) Configure your environment

Create a file named `.env.local` in the project root and add your Gemini API key:

```env
API_KEY=your_gemini_api_key_here
```

Note: this app reads `API_KEY` from the environment, not `GEMINI_API_KEY`.

### 3) Run the app locally

```bash
npm run dev
```

Then open the local URL shown in the terminal (typically `http://localhost:5173`).

### 4) Build for production

```bash
npm run build
```

## Project Structure

```text
.
├── App.tsx
├── components/
│   ├── ConfigurationDisplay.tsx
│   ├── ErrorMessage.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── UseCaseSelector.tsx
│   └── icons/
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── services/
│   └── geminiService.ts
├── types.ts
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

## Notes

- The app tries to generate a compatible PC configuration and validates compatibility through the Gemini model flow.
- Budget and region values are used to tailor both component selection and retailer links.
- Purchase links are intended to reflect local or regional retailers for the selected market.

## License

This project is currently unlicensed unless otherwise noted by the repository owner.
