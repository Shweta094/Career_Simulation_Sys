import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { career, userProfile } = body

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
You are an expert career counselor and data analyst. Generate a comprehensive 10-year career simulation for a ${career} role based on the following user profile:

**User Profile:**
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Personality Traits: ${userProfile.selectedTraits.join(", ")}
- Skills: ${userProfile.skills.join(", ")}
- Interests: ${userProfile.interests.join(", ")}
- Career Values: ${JSON.stringify(userProfile.values)}
- Preferences: ${JSON.stringify(userProfile.decisionAnswers)}

**Instructions:**
Generate a realistic career simulation with year-by-year progression for 10 years. Consider Indian job market conditions, salary ranges, and career progression patterns.

**Response Format (JSON only, no additional text):**
{
  "career": "${career}",
  "description": "2-3 sentence overview of the career",
  "industryOverview": "Current state and future outlook of the industry",
  "entryRequirements": ["requirement1", "requirement2", "requirement3"],
  "yearlyProjections": [
    {
      "year": 1,
      "title": "Job title for year 1",
      "salary": 600000,
      "satisfaction": 4.2,
      "workLifeBalance": 3.8,
      "burnoutRisk": 2.1,
      "lifestyle": "Description of lifestyle in this year",
      "keyMilestone": "Major achievement or milestone",
      "skillsRequired": ["skill1", "skill2"],
      "challenges": ["challenge1", "challenge2"],
      "opportunities": ["opportunity1", "opportunity2"]
    }
    // ... continue for 10 years
  ],
  "summary": {
    "avgSalary": 1200000,
    "peakSalary": 2500000,
    "avgSatisfaction": 4.1,
    "avgWorkLifeBalance": 3.7,
    "avgBurnoutRisk": 2.8,
    "careerProgression": "Final title achieved",
    "totalGrowth": "X% salary growth over 10 years"
  },
  "pros": ["advantage1", "advantage2", "advantage3"],
  "cons": ["disadvantage1", "disadvantage2", "disadvantage3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Generate only the JSON response, no additional formatting or text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse and validate the JSON response
    const simulation = JSON.parse(text)

    return NextResponse.json(simulation)
  } catch (error) {
    console.error("Error generating career simulation:", error)
    return NextResponse.json({ error: "Failed to generate career simulation" }, { status: 500 })
  }
}
