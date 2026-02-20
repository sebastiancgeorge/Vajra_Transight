'use server';
/**
 * @fileOverview Identifies and classifies the primary intent of a customer conversation.
 *
 * - identifyPrimaryCustomerIntent - A function that handles the identification of the primary customer intent.
 * - IdentifyPrimaryCustomerIntentInput - The input type for the identifyPrimaryCustomerIntent function.
 * - IdentifyPrimaryCustomerIntentOutput - The return type for the identifyPrimaryCustomerIntent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyPrimaryCustomerIntentInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the customer conversation.'),
});
export type IdentifyPrimaryCustomerIntentInput = z.infer<typeof IdentifyPrimaryCustomerIntentInputSchema>;

const IdentifyPrimaryCustomerIntentOutputSchema = z.object({
  primaryCustomerIntent: z
    .string()
    .describe("A concise classification of the customer's primary intent (e.g., 'Technical Support', 'Billing Inquiry', 'Product Feedback', 'Sales Inquiry', 'Cancellation Request')."),
});
export type IdentifyPrimaryCustomerIntentOutput = z.infer<typeof IdentifyPrimaryCustomerIntentOutputSchema>;

export async function identifyPrimaryCustomerIntent(
  input: IdentifyPrimaryCustomerIntentInput
): Promise<IdentifyPrimaryCustomerIntentOutput> {
  return identifyPrimaryCustomerIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPrimaryCustomerIntentPrompt',
  input: { schema: IdentifyPrimaryCustomerIntentInputSchema },
  output: { schema: IdentifyPrimaryCustomerIntentOutputSchema },
  prompt: `Given the following customer conversation transcript, identify and classify the primary intent of the customer. Your response should be a concise classification.
The transcript may contain multiple speakers, identified by 'Speaker (Name):'.

Here are some examples of classifications:
- 'Technical Support'
- 'Billing Inquiry'
- 'Product Feedback'
- 'Sales Inquiry'
- 'Cancellation Request'
- 'General Inquiry'
- 'Complaint'
- 'Feature Request'
- 'Order Status'

Transcript:
{{{transcript}}}`,
});

const identifyPrimaryCustomerIntentFlow = ai.defineFlow(
  {
    name: 'identifyPrimaryCustomerIntentFlow',
    inputSchema: IdentifyPrimaryCustomerIntentInputSchema,
    outputSchema: IdentifyPrimaryCustomerIntentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
