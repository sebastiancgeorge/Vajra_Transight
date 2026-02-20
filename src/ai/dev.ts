import { config } from 'dotenv';
config();

// Import only the single, consolidated flow
import '@/ai/flows/analyze-conversation.ts';
import '@/ai/flows/identify-primary-customer-intent.ts';
import '@/ai/flows/summarize-conversation-and-extract-topics.ts';
import '@/ai/flows/detect-compliance-policy-violations-flow.ts';
import '@/ai/flows/generate-agent-performance-coaching.ts';
import '@/ai/flows/analyze-sentiment-timeline.ts';
import '@/ai/flows/classify-call-outcome-flow.ts';
import '@/ai/flows/detect-languages-flow.ts';
import '@/ai/flows/generate-risk-score-flow.ts';
import '@/ai/flows/transcribe-audio.ts';
