'use server';
/**
 * @fileOverview A Genkit flow for detecting compliance and policy violations in conversations.
 *
 * - detectCompliancePolicyViolations - A function that handles the detection of policy violations.
 * - DetectCompliancePolicyViolationsInput - The input type for the detectCompliancePolicyViolations function.
 * - DetectCompliancePolicyViolationsOutput - The return type for the detectCompliancePolicyViolations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyViolationDetailSchema = z.object({
  policyViolated: z.string().describe('The specific policy that was violated.'),
  violationDescription: z
    .string()
    .describe('A detailed explanation of the violation.'),
  relevantExcerpt: z
    .string()
    .describe('A relevant snippet from the conversation where the violation occurred.'),
  severity: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .describe('The severity of the detected violation.'),
});

const DetectCompliancePolicyViolationsInputSchema = z.object({
  conversationTranscript: z.string().describe('The full transcript of the customer conversation.'),
  policyDocuments: z
    .array(z.string())
    .describe('An array of relevant policy documents or rules to check against. Each string is a separate policy or rule.'),
});
export type DetectCompliancePolicyViolationsInput = z.infer<
  typeof DetectCompliancePolicyViolationsInputSchema
>;

const DetectCompliancePolicyViolationsOutputSchema = z.object({
  violationsDetected: z.boolean().describe('True if any policy violations were detected, false otherwise.'),
  violationDetails: z
    .array(PolicyViolationDetailSchema)
    .describe('An array of objects, each detailing a detected policy violation.'),
});
export type DetectCompliancePolicyViolationsOutput = z.infer<
  typeof DetectCompliancePolicyViolationsOutputSchema
>;

const detectCompliancePolicyViolationsPrompt = ai.definePrompt({
  name: 'detectCompliancePolicyViolationsPrompt',
  input: {schema: DetectCompliancePolicyViolationsInputSchema},
  output: {schema: DetectCompliancePolicyViolationsOutputSchema},
  prompt: `You are an expert compliance officer tasked with reviewing customer conversations for adherence to company policies and regulatory requirements.

Your goal is to identify any instances where the conversation transcript violates the provided policy documents. The transcript may contain multiple speakers, identified by 'Speaker (Name):'.

Analyze the following conversation transcript against the given policy documents. If any violations are found, detail each violation clearly, specifying the policy violated, a description of how it was violated, a relevant excerpt from the conversation, and its severity (LOW, MEDIUM, HIGH).
If no violations are detected, set 'violationsDetected' to false and provide an empty array for 'violationDetails'.

Conversation Transcript:
{{conversationTranscript}}

Policy Documents:
{{#each policyDocuments}}
- {{{this}}}
{{/each}}
`,
});

export async function detectCompliancePolicyViolations(
  input: DetectCompliancePolicyViolationsInput
): Promise<DetectCompliancePolicyViolationsOutput> {
  return detectCompliancePolicyViolationsFlow(input);
}

const detectCompliancePolicyViolationsFlow = ai.defineFlow(
  {
    name: 'detectCompliancePolicyViolationsFlow',
    inputSchema: DetectCompliancePolicyViolationsInputSchema,
    outputSchema: DetectCompliancePolicyViolationsOutputSchema,
  },
  async (input) => {
    const {output} = await detectCompliancePolicyViolationsPrompt(input);
    return output!;
  }
);
