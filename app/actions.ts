'use server'
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeResume(jobDescription: string, resumeText: string) {
  if (!jobDescription || !resumeText) return "Error";

  const prompt = `
  You are a Senior Technical Recruiter and ATS Optimization Expert.
  Analyze the Resume against the Job Description with surgical precision.

  CRITICAL SCORING RULES:
  1. matchScore: Scale 0-100. (80+ = Strong, 50-79 = Partial, <50 = Low).
  2. If the resume is missing a core required framework (e.g. React for a Front-end role), the score cannot exceed 60.

  OUTPUT STRUCTURE (STRICT JSON ONLY):
  {
    "matchScore": number,
    "verdict": "Strong Match" | "Partial Match" | "Low Match",
    "summary": "A deep 3-sentence analysis of the alignment.",
    "skills": {
      "matched": ["Exact matches found"],
      "missing": ["Crucial missing requirements"],
      "bonus": ["Skills the candidate has that weren't asked for but add value"]
    },
    "atsAnalysis": {
      "missingKeywords": ["Specific industry terms missing"],
      "redFlags": ["e.g., 'No quantifiable metrics', 'Vague job titles'"],
      "formattingWarnings": ["e.g., 'Complex layout might break parser'"]
    },
    "bulletPointFixes": [
      { 
        "original": "The weakest bullet point in the resume",
        "suggested": "The upgraded version with metrics (%, $, #)",
        "improvement": "Explain why this change helps (e.g., 'Adds quantifiable impact')" 
      }
    ],
    "fiveMinuteFixes": ["3 immediate actions to take right now"]
  }
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Job: ${jobDescription}\n\nResume: ${resumeText}` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }, // Forces JSON output
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    return { error: "Failed to analyze" };
  }
}

// The Refiner stays the same
export async function refineJobDescription(messyText: string) {
  if (!messyText) return "";
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional job analyst. Rewrite into one clear, telling paragraph. Focus on core roles and tools. Strip emojis."
        },
        {
          role: "user",
          content: messyText
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 250,
    });
    return response.choices[0]?.message?.content || "Refinement failed.";
  } catch (error) {
    return "Error refining text.";
  }
}