This document describes the two main endpoints used in the call processing workflow:

/api/transcribe → Converts audio to text

/api/analyze → Performs AI-powered analysis on the transcript

It also includes a full Python workflow example.

1️⃣ /api/transcribe

This endpoint accepts raw audio (Base64 encoded) and returns a text transcript.

🔹 Request Format

The audioDataUri must be a valid Base64 string in Data URI format.

{
  "audioDataUri": "data:audio/wav;base64,UklGRiSDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YS..."
}
🔹 Response Format
{
  "transcript": "Agent: Thank you for calling Verity Support, this is Sebastian. How can I help you today?\nCustomer: Hi, I'm having trouble with my Poco phone's proximity sensor. It won't turn off during calls."
}
2️⃣ /api/analyze

This endpoint performs AI-based analysis on the transcript.

You send the transcript returned from /api/transcribe into this endpoint.

🔹 Request Format
{
  "transcript": "Agent: Thank you for calling Verity Support, this is Sebastian. How can I help you today?\nCustomer: Hi, I'm having trouble with my Poco phone's proximity sensor. It won't turn off during calls.\nAgent: I'm sorry to hear that. Let's try to recalibrate it in the settings.\nCustomer: I've tried that twice and it still fails. I'm very frustrated.\nAgent: I understand. Let's look at a hardware replacement."
}
🔹 Response Format
{
  "transcript": "Agent: Thank you for calling...",
  "languages": ["English"],
  "summary": "Customer called regarding a faulty proximity sensor on a Poco device. After troubleshooting failed, the agent suggested a hardware replacement.",
  "overallSentiment": "Neutral",
  "primaryCustomerIntent": "Technical Support",
  "keyTopics": ["Poco phone", "Proximity Sensor", "Hardware Replacement"],
  "sentimentTimeline": [
    {
      "segment": 1,
      "time": "0:05",
      "sentiment": 0.5,
      "text": "Initial greeting and professional opening."
    },
    {
      "segment": 2,
      "time": "0:45",
      "sentiment": -0.6,
      "text": "Customer expresses frustration after troubleshooting fails."
    }
  ],
  "policyViolations": [],
  "agentPerformance": {
    "agentName": "Sebastian George",
    "agentId": "SG-2026",
    "overallScore": 92,
    "strengths": ["Empathy", "Quick problem identification"],
    "areasForImprovement": ["Following standard closing script"],
    "actionableCoachingPoints": [
      {
        "point": "Maintain calm tone when customer expresses high frustration.",
        "reference": "Customer: I've tried that twice and it still fails."
      }
    ],
    "talkToListenRatio": "40:60",
    "interruptionCount": 0,
    "sentimentTrend": "Stable"
  },
  "callOutcome": {
    "outcome": "Resolved",
    "reason": "Hardware replacement ticket was initiated."
  },
  "riskScore": {
    "score": 15,
    "reason": "Low risk; customer was frustrated but accepted the resolution."
  }
}
