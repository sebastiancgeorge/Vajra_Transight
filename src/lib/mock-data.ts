import type { AnalysisResult } from '@/lib/types';

export const mockTranscript = `Customer: Hi, I'm having trouble with my new XT-5000 camera. The battery seems to die incredibly fast. I charged it all night, and it was dead in an hour.

Agent (Sarah): Hello, thank you for calling TechSupport. My name is Sarah. I'm sorry to hear you're having issues with your new XT-5000. I can definitely help you with that. Can you confirm the purchase date?

Customer: I just bought it two days ago from your website. I was so excited to use it for my trip this weekend, but now I'm just frustrated. Is this a known issue?

Agent (Sarah): I understand your frustration completely. Let me check the records for you. While I do that, can you tell me if you are using the charger that came with the camera? Using a third-party charger can sometimes cause issues.

Customer: Yes, of course, I'm using the one from the box. Honestly, for a $1200 camera, I expected much better. My old camera from a competitor brand never had this problem.

Agent (Sarah): I see. And you're right to expect top performance. It seems there was a bad batch of batteries in a small number of XT-5000 units. It looks like your camera is one of them. The good news is we can resolve this quickly. According to our policy, we can send you a replacement unit with expedited shipping, and it should arrive within two business days. We'll also include a complimentary high-capacity battery for the inconvenience.

Customer: Oh, really? That's... actually a great solution. So you'll send a whole new camera?

Agent (Sarah): That's correct. A brand new XT-5000, plus an extra battery. I can process that for you right now. I just need to confirm your shipping address.

Customer: Wow, okay. That's much better than I expected. My address is 123 Pine Street, Anytown, USA.

Agent (Sarah): Perfect, 123 Pine Street. I've put the order through. Your new camera will be on its way shortly, and you'll receive a tracking number via email within the hour. Is there anything else I can help you with today?

Customer: No, that's it. Thank you, Sarah. You've been very helpful. I was ready for a fight, but this was easy.

Agent (Sarah): You're very welcome! We want you to enjoy your camera. Have a great day and an amazing trip!`;

export const mockAnalysisResult: AnalysisResult = {
  transcript: mockTranscript,
  language: 'English (US)',
  summary: 'The customer reported a severe battery drain issue with their recently purchased XT-5000 camera. The agent, Sarah, identified the problem as part of a known faulty batch, and efficiently processed a replacement unit with an additional complimentary battery, leading to high customer satisfaction.',
  overallSentiment: 'Positive',
  primaryCustomerIntent: 'Technical Support',
  keyTopics: ['Battery Issue', 'XT-5000 Camera', 'Replacement Process', 'Customer Frustration', 'Policy Adherence'],
  sentimentTimeline: [
    { segment: 1, time: '0:00', sentiment: -0.8, text: 'Customer expresses frustration about battery.' },
    { segment: 2, time: '0:25', sentiment: 0.2, text: 'Agent is empathetic and starts troubleshooting.' },
    { segment: 3, time: '0:50', sentiment: -0.6, text: 'Customer frustration peaks, compares to competitor.' },
    { segment: 4, time: '1:15', sentiment: 0.9, text: 'Agent provides an excellent resolution.' },
    { segment: 5, time: '1:45', sentiment: 1.0, text: 'Customer expresses high satisfaction and gratitude.' },
  ],
  policyViolations: [
    {
      policyViolated: 'Data Security - PII Handling',
      violationDescription: "The agent did not explicitly ask for the customer's consent before confirming the shipping address on a recorded line.",
      relevantExcerpt: 'I just need to confirm your shipping address.',
      severity: 'LOW',
    },
  ],
  agentPerformance: {
    agentName: 'Sarah',
    agentId: 'A-78910',
    agentAvatarUrl: 'https://picsum.photos/seed/agent/100/100',
    overallScore: 92,
    strengths: [
      'Excellent empathy and rapport building.',
      'Quickly identified the root cause of the issue.',
      'Effectively de-escalated a frustrated customer.',
      'Provided a swift and satisfactory resolution exceeding customer expectations.',
    ],
    areasForImprovement: [
      'Ensure explicit consent is obtained before handling Personally Identifiable Information (PII) like a shipping address.',
    ],
    actionableCoachingPoints: [
      {
        point: 'When confirming sensitive information, please use a phrase like "With your permission, can you confirm your shipping address for me?" to ensure full compliance.',
        reference: 'Timestamp 1:47',
      },
      {
        point: 'Continue to leverage your excellent problem-solving skills to turn negative experiences into positive ones. Your handling of the replacement was textbook perfect.',
        reference: 'Timestamp 1:15',
      },
    ],
  },
  trends: {
    topIssues: [
      { issue: 'Battery Drain', count: 45 },
      { issue: 'Login Failure', count: 23 },
      { issue: 'Shipping Delay', count: 18 },
      { issue: 'Billing Error', count: 12 },
    ],
  },
};
