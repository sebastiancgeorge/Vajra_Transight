import { config } from 'dotenv';
config();

import '@/ai/flows/identify-primary-customer-intent.ts';
import '@/ai/flows/summarize-conversation-and-extract-topics.ts';
import '@/ai/flows/detect-compliance-policy-violations-flow.ts';
import '@/ai/flows/generate-agent-performance-coaching.ts';
import '@/ai/flows/analyze-sentiment-timeline.ts';
