# Drug Navigator (代替薬ナビゲーター)

## Overview
**Drug Navigator** is an AI-powered assistant designed to help pharmacists quickly identify suitable alternative medications during supply shortages.
It leverages **Google Gemini 2.5 Flash Lite** to analyze patient contexts (Pediatric, Pregnant, Lactating, Renal Impairment) and safety guidelines, generating tailored recommendations and explanations.

## Features
*   **AI-Powered Suggestions:** Suggests up to 15 alternative ethical drugs based on input drug and patient background.
*   **Safety Assessment:** Checks contraindications against major guidelines (FDA, JSNP, etc.).
*   **Context Awareness:** Adjusts logic for Child, Pregnant, Lactating, and Renal Impairment contexts.
*   **Stock Integration:** Prioritizes items based on shipment status data (from Google Sheets CSV).
*   **Explanations:** Generates specific explanations for both Doctors (clinical logic) and Patients (plain language).

## Tech Stack
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **AI:** Google Gemini API (gemini-2.5-flash-lite-preview-09-2025)
*   **Deployment:** Vercel

## Getting Started

### Prerequisites
*   Node.js 18+
*   Google Gemini API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/drug-navigator.git
    cd drug-navigator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Security & Privacy
*   **No PII Storage:** The application does not store or process patient names or IDs. Only generic background flags are used.
*   **Input Validation:** Strict sanitization is in place to prevent prompt injection attacks.
*   **API Security:** API keys are handled server-side.

## License
This project is proprietary.