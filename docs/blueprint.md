# **App Name**: Verity Insights

## Core Features:

- Multimodal Input Processing: Accepts audio files or text-based conversation transcripts. Audio processing leverages AssemblyAI for transcription.
- Language Auto-detection: Automatically detects the language of the conversation using AssemblyAI's language detection API.
- Core Conversation Intelligence: Extracts key insights: conversation summary, overall sentiment, primary customer intent, and key topics discussed using a combination of AssemblyAI and Gemini.
- RAG-Enhanced Configurable Context: Uses a Retrieval-Augmented Generation (RAG) system to incorporate client-defined configurations (business domain, products, policies) into the analysis using Pinecone to store context and Gemini for the LLM.
- Policy Violation Detection: Detects compliance or policy violations by comparing the conversation content against configured rules using the RAG system for context and Gemini as the tool, incorporating policy information when relevant.
- Sentiment Timeline: Generate a timeline of the changes in sentiment, and provide insights on which sections/timestamps during the conversation lead to a particular sentiment using the sentiment analysis features provided by AssemblyAI.
- Structured JSON Output: Provides well-structured JSON responses containing analytical results, detected risks, and classifications. Ready for enterprise application integration.
- Agent Performance Scoring: Scores agent performance based on sentiment, talk time, and adherence to compliance policies. Provides actionable insights for coaching and improvement.
- Predictive Insights & Trend Analysis: Identifies trends in customer conversations to proactively address emerging issues, improve products/services, and predict future customer behavior.
- Customizable Reporting Dashboard: Offers a customizable dashboard to visualize key conversation intelligence metrics and trends, enabling data-driven decision-making.

## Style Guidelines:

- Primary color: Deep blue (#2E3192) to convey trust and intelligence.
- Background color: Light gray (#F0F2F5), desaturated from the primary blue, for a clean interface.
- Accent color: Gold (#D4AF37) for highlighting key insights and actionable items.
- Headline font: 'Space Grotesk' sans-serif for a tech-forward, computerized aesthetic.
- Body font: 'Inter' sans-serif to complement the headline, providing a clean and neutral look for longer text.
- Code font: 'Source Code Pro' for displaying API documentation snippets.
- Use consistent and professional icons to represent different insights and classifications.
- Design a clear, modular layout with well-defined sections for each insight category.
- Incorporate subtle animations (e.g., progress loaders, smooth transitions) to enhance user experience.