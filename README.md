# Verity Insights: AI-Powered Conversation Intelligence

Verity Insights is a sophisticated, AI-driven platform designed to transcribe and analyze customer service conversations. It provides deep, actionable insights into agent performance, policy compliance, customer sentiment, and overall call outcomes.

## Key Features

- **Accurate Audio Transcription**: Leverages AssemblyAI's specialized speech-to-text models to accurately transcribe audio files, correctly identifying different speakers.
- **Comprehensive AI Analysis**: Uses Google's powerful Gemini models to perform a multi-faceted analysis of conversation transcripts.
- **Detailed Metrics & Insights**:
  - **Sentiment Analysis**: Tracks the emotional trajectory of the conversation with a segment-by-segment timeline.
  - **Policy Compliance**: Automatically detects violations against a configurable set of company policies and rules.
  - **Agent Performance Coaching**: Generates an overall performance score, highlights strengths, identifies areas for improvement, and provides specific, actionable coaching points. Includes metrics like talk-to-listen ratio and interruption counts.
  - **Intent & Topic Extraction**: Identifies the primary customer intent and key topics discussed.
  - **Risk Assessment**: Calculates a customer churn/escalation risk score based on the conversation's content and tone.
- **Persistent History**: Securely stores and retrieves conversation analysis history using Firebase Firestore.
- **Dynamic Configuration**: Allows for client-defined configuration of business context, products, and compliance policies that directly influence the AI analysis.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components for a modern, responsive interface.
- **Generative AI**: Genkit for orchestrating AI flows with Google's Gemini models.
- **Transcription**: AssemblyAI for specialized speech-to-text processing.
- **Backend & Database**: Firebase (Firestore for database, Authentication for user management).

## Project Structure

A brief overview of the key directories in the project:

- `src/app/`: Contains the main application pages and API routes (using Next.js App Router).
  - `(pages)/`: The main dashboard and settings pages.
  - `api/`: API endpoints for transcription (`/api/transcribe`) and analysis (`/api/analyze`).
- `src/ai/`: Home for all Genkit-related code.
  - `flows/`: Contains all the defined AI flows for analysis, transcription, etc.
- `src/components/`: Reusable React components, organized by feature (dashboard, layout, settings) and the base UI library (`ui/`).
- `src/firebase/`: All Firebase-related setup, providers, and hooks for interacting with Firestore and Auth.
- `src/lib/`: Core application logic, type definitions (`types.ts`), and configuration (`organization.ts`).
- `docs/`: Project documentation, including the data model (`backend.json`) and API specification (`openapi.yaml`).

## Getting Started

Follow these steps to get a local development environment running.

### Prerequisites

- Node.js (v18 or later)
- An `npm` or `yarn` package manager

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

The application requires an API key from AssemblyAI for audio transcription.

1.  Create a `.env` file in the root of the project.
2.  Sign up for a free account at [AssemblyAI](https://www.assemblyai.com/start) to get your API key.
3.  Add your key to the `.env` file:
    ```env
    ASSEMBLYAI_API_KEY="your_assemblyai_api_key_here"
    ```
> **Note on Firebase**: The Firebase configuration is handled automatically by Firebase App Hosting. For local development, the necessary credentials are included in `src/firebase/config.ts`. No additional setup is required.

### Running the Development Server

To start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## API Endpoints

The application exposes two main API endpoints. See `docs/openapi.yaml` for a detailed specification.

- **`POST /api/transcribe`**: Accepts an audio file and returns the transcribed text.
- **`POST /api/analyze`**: Accepts a conversation transcript and returns a comprehensive AI analysis.

## Configuration

The AI analysis can be customized by modifying the configuration object in `src/lib/organization.ts`. This file allows you to define:

- **Business Domain**: The industry context (e.g., 'E-commerce').
- **Products**: A list of company products to help the AI identify them in conversations.
- **Policies**: A list of rules and policies that the AI will use to check for compliance violations.
