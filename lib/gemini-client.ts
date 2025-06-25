import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI with better error handling
const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

  if (!apiKey || apiKey.trim() === "" || apiKey === "AIzaSyAXInyezkbPvAbFSq3h42AKmX6XQQCY6Uk") {
    console.log("Gemini API key not configured. Using enhanced mock data.")
    return null
  }

  try {
    return new GoogleGenerativeAI(apiKey)
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error)
    return null
  }
}

export interface CareerSimulationRequest {
  career: string
  userProfile: {
    name: string
    age: number
    selectedTraits: string[]
    skills: string[]
    interests: string[]
    values: Record<string, number[]>
    decisionAnswers: Record<string, string>
  }
}

export interface RecommendedCourse {
  title: string
  provider: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: "Technical" | "Soft Skills" | "Certification" | "Leadership" | "Industry-Specific"
  priority: "High" | "Medium" | "Low"
  description: string
  estimatedCost: string
}

export interface YearlyData {
  year: number
  title: string
  salary: number
  satisfaction: number
  workLifeBalance: number
  burnoutRisk: number
  lifestyle: string
  keyMilestone: string
  skillsRequired: string[]
  challenges: string[]
  opportunities: string[]
  recommendedCourses: RecommendedCourse[]
}

export interface CareerSimulation {
  career: string
  description: string
  industryOverview: string
  entryRequirements: string[]
  yearlyProjections: YearlyData[]
  summary: {
    avgSalary: number
    peakSalary: number
    avgSatisfaction: number
    avgWorkLifeBalance: number
    avgBurnoutRisk: number
    careerProgression: string
    totalGrowth: string
  }
  pros: string[]
  cons: string[]
  recommendations: string[]
  isAIGenerated: boolean
  generationMethod: "gemini-flash" | "enhanced-mock"
}

export class GeminiCareerSimulator {
  private genAI: GoogleGenerativeAI | null
  private flashModel: any

  constructor() {
    this.genAI = getGeminiClient()

    if (this.genAI) {
      try {
        this.flashModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        console.log("✅ Gemini Flash model initialized successfully")
      } catch (error) {
        console.error("Failed to initialize Gemini Flash model:", error)
        this.flashModel = null
      }
    } else {
      this.flashModel = null
      console.log("⚠️ Gemini API not available - using enhanced mock data")
    }
  }

  async generateCareerSimulation(request: CareerSimulationRequest): Promise<CareerSimulation> {
    // Try Gemini Flash first
    if (this.flashModel) {
      try {
        console.log("🤖 Attempting Gemini Flash generation for:", request.career)
        const simulation = await this.tryGenerateWithModel(request, this.flashModel, "gemini-flash")
        if (simulation) {
          console.log("✅ Successfully generated with Gemini Flash")
          return simulation
        }
      } catch (error) {
        console.warn("⚠️ Gemini Flash failed:", error.message)
      }
    }

    // Fallback to enhanced mock
    console.log("🔄 Using enhanced mock data for:", request.career)
    const mockSimulation = this.generateEnhancedMockSimulation(request)
    mockSimulation.generationMethod = "enhanced-mock"
    return mockSimulation
  }

  private async tryGenerateWithModel(
    request: CareerSimulationRequest,
    model: any,
    method: "gemini-flash",
  ): Promise<CareerSimulation | null> {
    const prompt = this.buildSimulationPrompt(request)

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Clean the response text
      const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim()

      // Parse the JSON response
      const simulation = JSON.parse(cleanedText) as CareerSimulation
      simulation.isAIGenerated = true
      simulation.generationMethod = method

      // Validate the simulation has required fields
      if (!simulation.career || !simulation.yearlyProjections || simulation.yearlyProjections.length === 0) {
        throw new Error("Invalid simulation structure")
      }

      return simulation
    } catch (error) {
      console.error(`Error with ${method}:`, error)
      return null
    }
  }

  async generateMultipleSimulations(requests: CareerSimulationRequest[]): Promise<CareerSimulation[]> {
    const results = []

    for (const request of requests) {
      try {
        const simulation = await this.generateCareerSimulation(request)
        results.push(simulation)

        // Add delay between requests to avoid rate limiting
        if (this.flashModel) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }
      } catch (error) {
        console.error(`Failed to generate simulation for ${request.career}:`, error)
        const fallbackSimulation = this.generateEnhancedMockSimulation(request)
        fallbackSimulation.generationMethod = "enhanced-mock"
        results.push(fallbackSimulation)
      }
    }

    return results
  }

  private buildSimulationPrompt(request: CareerSimulationRequest): string {
    const { career, userProfile } = request

    return `
You are an expert career counselor and learning advisor specializing in the Indian job market. Generate a comprehensive 10-year career simulation for a ${career} role with detailed course recommendations for each year.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Traits: ${userProfile.selectedTraits.join(", ")}
- Skills: ${userProfile.skills.join(", ")}
- Interests: ${userProfile.interests.join(", ")}
- Values: Salary importance ${userProfile.values.salary?.[0] || 50}%, Work-life balance ${userProfile.values.workLifeBalance?.[0] || 50}%
- Preferences: ${JSON.stringify(userProfile.decisionAnswers)}

Generate a realistic career simulation with specific course recommendations for skill development at each stage.

CRITICAL: Respond with ONLY valid JSON, no additional text, markdown, or formatting:

{
  "career": "${career}",
  "description": "Brief career overview (2-3 sentences)",
  "industryOverview": "Industry state and outlook in India",
  "entryRequirements": ["requirement1", "requirement2", "requirement3"],
  "yearlyProjections": [
    {
      "year": 1,
      "title": "Entry level position",
      "salary": 600000,
      "satisfaction": 4.0,
      "workLifeBalance": 3.5,
      "burnoutRisk": 2.0,
      "lifestyle": "Lifestyle description for this year",
      "keyMilestone": "Key achievement or milestone",
      "skillsRequired": ["skill1", "skill2", "skill3"],
      "challenges": ["challenge1", "challenge2"],
      "opportunities": ["opportunity1", "opportunity2"],
      "recommendedCourses": [
        {
          "title": "Course name",
          "provider": "Platform/Institution",
          "duration": "X weeks/months",
          "difficulty": "Beginner",
          "type": "Technical",
          "priority": "High",
          "description": "Brief course description and benefits",
          "estimatedCost": "Free/₹X,XXX"
        }
      ]
    }
  ],
  "summary": {
    "avgSalary": 1200000,
    "peakSalary": 2500000,
    "avgSatisfaction": 4.1,
    "avgWorkLifeBalance": 3.7,
    "avgBurnoutRisk": 2.8,
    "careerProgression": "Senior position title",
    "totalGrowth": "300%"
  },
  "pros": ["advantage1", "advantage2", "advantage3"],
  "cons": ["challenge1", "challenge2", "challenge3"],
  "recommendations": ["advice1", "advice2", "advice3"]
}

Guidelines for course recommendations:
1. Include 2-4 courses per year based on career stage
2. Mix technical skills, soft skills, and certifications
3. Use real platforms: Coursera, Udemy, edX, LinkedIn Learning, Pluralsight, etc.
4. Include Indian institutions: IITs, IIMs, NPTEL, SWAYAM
5. Vary difficulty from Beginner to Advanced as career progresses
6. Include industry certifications (AWS, Google, Microsoft, etc.)
7. Add leadership and management courses in later years
8. Consider cost-effective options including free courses
9. Align courses with skills required for that year
10. Include emerging technology courses relevant to the field

Generate exactly 10 years of yearlyProjections with realistic course recommendations for each year.
`
  }

  public generateEnhancedMockSimulation(request: CareerSimulationRequest): CareerSimulation {
    const { career, userProfile } = request

    // Enhanced mock data based on career type and user profile
    const careerData = this.getCareerBaseData(career)
    const yearlyProjections: YearlyData[] = []

    let baseSalary = careerData.startingSalary
    const hasHighGrowthTraits = userProfile.selectedTraits?.some((trait: string) =>
      ["Leadership", "Strategic", "Entrepreneurial", "Innovative", "Ambitious"].includes(trait),
    )

    const hasStabilityTraits = userProfile.selectedTraits?.some((trait: string) =>
      ["Organized", "Detail-oriented", "Patient", "Methodical"].includes(trait),
    )

    for (let year = 1; year <= 10; year++) {
      // Calculate salary growth based on career and traits
      let salaryGrowth = careerData.baseGrowthRate + (Math.random() * 0.1 - 0.05)

      if (hasHighGrowthTraits && year <= 5) {
        salaryGrowth *= 1.3 // Higher early growth for ambitious traits
      }

      if (hasStabilityTraits && year > 5) {
        salaryGrowth *= 1.1 // Steady growth for stability-oriented people
      }

      baseSalary *= 1 + salaryGrowth

      // Calculate satisfaction based on traits and career stage
      let satisfaction = careerData.baseSatisfaction
      if (hasHighGrowthTraits && year <= 3) satisfaction += 0.5
      if (hasStabilityTraits && year > 5) satisfaction += 0.3
      satisfaction += Math.random() * 1.0 - 0.5 // Add some variance
      satisfaction = Math.max(1, Math.min(5, satisfaction))

      // Calculate work-life balance
      let workLifeBalance = careerData.baseWorkLife
      if (year > 5 && hasStabilityTraits) workLifeBalance += 0.5
      workLifeBalance += Math.random() * 0.8 - 0.4
      workLifeBalance = Math.max(1, Math.min(5, workLifeBalance))

      // Calculate burnout risk
      let burnoutRisk = careerData.baseBurnout
      if (hasHighGrowthTraits && year <= 5) burnoutRisk += 0.5
      if (workLifeBalance < 3) burnoutRisk += 0.5
      burnoutRisk += Math.random() * 0.6 - 0.3
      burnoutRisk = Math.max(1, Math.min(5, burnoutRisk))

      yearlyProjections.push({
        year,
        title: this.getJobTitle(career, year, hasHighGrowthTraits),
        salary: Math.round(baseSalary),
        satisfaction: Math.round(satisfaction * 10) / 10,
        workLifeBalance: Math.round(workLifeBalance * 10) / 10,
        burnoutRisk: Math.round(burnoutRisk * 10) / 10,
        lifestyle: this.getLifestyleDescription(career, year, workLifeBalance),
        keyMilestone: this.getMilestone(career, year),
        skillsRequired: this.getSkillsRequired(career, year) || [],
        challenges: this.getChallenges(career, year) || [],
        opportunities: this.getOpportunities(career, year) || [],
        recommendedCourses: this.getRecommendedCourses(career, year, hasHighGrowthTraits) || [],
      })
    }

    const avgSalary = Math.round(yearlyProjections.reduce((sum, y) => sum + y.salary, 0) / 10)
    const peakSalary = Math.max(...yearlyProjections.map((y) => y.salary))
    const totalGrowthPercent = Math.round(
      ((peakSalary - yearlyProjections[0].salary) / yearlyProjections[0].salary) * 100,
    )

    return {
      career,
      description: careerData.description,
      industryOverview: careerData.industryOverview,
      entryRequirements: careerData.entryRequirements,
      yearlyProjections,
      summary: {
        avgSalary,
        peakSalary,
        avgSatisfaction: Math.round((yearlyProjections.reduce((sum, y) => sum + y.satisfaction, 0) / 10) * 10) / 10,
        avgWorkLifeBalance:
          Math.round((yearlyProjections.reduce((sum, y) => sum + y.workLifeBalance, 0) / 10) * 10) / 10,
        avgBurnoutRisk: Math.round((yearlyProjections.reduce((sum, y) => sum + y.burnoutRisk, 0) / 10) * 10) / 10,
        careerProgression: yearlyProjections[9].title,
        totalGrowth: `${totalGrowthPercent}%`,
      },
      pros: careerData.pros,
      cons: careerData.cons,
      recommendations: careerData.recommendations,
      isAIGenerated: false,
      generationMethod: "enhanced-mock",
    }
  }

  private getRecommendedCourses(career: string, year: number, hasHighGrowthTraits: boolean): RecommendedCourse[] {
    const courseDatabase: Record<string, Record<number, RecommendedCourse[]>> = {
      "Software Engineer": {
        1: [
          {
            title: "Complete Web Development Bootcamp",
            provider: "Udemy",
            duration: "12 weeks",
            difficulty: "Beginner",
            type: "Technical",
            priority: "High",
            description: "Master HTML, CSS, JavaScript, and modern frameworks to build full-stack applications",
            estimatedCost: "₹2,000",
          },
          {
            title: "Git & GitHub Masterclass",
            provider: "Coursera",
            duration: "4 weeks",
            difficulty: "Beginner",
            type: "Technical",
            priority: "High",
            description: "Essential version control skills for collaborative software development",
            estimatedCost: "Free",
          },
          {
            title: "Programming Fundamentals with Python",
            provider: "NPTEL",
            duration: "8 weeks",
            difficulty: "Beginner",
            type: "Technical",
            priority: "Medium",
            description: "Build strong programming foundations with Python",
            estimatedCost: "Free",
          },
        ],
        2: [
          {
            title: "React.js Complete Course",
            provider: "Pluralsight",
            duration: "6 weeks",
            difficulty: "Intermediate",
            type: "Technical",
            priority: "High",
            description: "Master React.js for building modern user interfaces",
            estimatedCost: "₹3,500",
          },
          {
            title: "Database Design and SQL",
            provider: "edX",
            duration: "8 weeks",
            difficulty: "Intermediate",
            type: "Technical",
            priority: "High",
            description: "Learn database design principles and advanced SQL queries",
            estimatedCost: "₹5,000",
          },
          {
            title: "Agile Software Development",
            provider: "LinkedIn Learning",
            duration: "3 weeks",
            difficulty: "Beginner",
            type: "Soft Skills",
            priority: "Medium",
            description: "Understand Agile methodologies and Scrum practices",
            estimatedCost: "₹2,500",
          },
        ],
        3: [
          {
            title: "System Design Interview Prep",
            provider: "Educative",
            duration: "10 weeks",
            difficulty: "Intermediate",
            type: "Technical",
            priority: "High",
            description: "Master system design concepts for senior engineering roles",
            estimatedCost: "₹8,000",
          },
          {
            title: "AWS Cloud Practitioner",
            provider: "AWS Training",
            duration: "6 weeks",
            difficulty: "Intermediate",
            type: "Certification",
            priority: "High",
            description: "Get certified in AWS cloud services and architecture",
            estimatedCost: "₹12,000",
          },
          {
            title: "Code Review Best Practices",
            provider: "Pluralsight",
            duration: "2 weeks",
            difficulty: "Intermediate",
            type: "Technical",
            priority: "Medium",
            description: "Learn effective code review techniques and mentoring skills",
            estimatedCost: "₹3,500",
          },
        ],
        4: [
          {
            title: "Microservices Architecture",
            provider: "Coursera",
            duration: "8 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "High",
            description: "Design and implement scalable microservices architectures",
            estimatedCost: "₹6,000",
          },
          {
            title: "Technical Leadership",
            provider: "LinkedIn Learning",
            duration: "4 weeks",
            difficulty: "Intermediate",
            type: "Leadership",
            priority: "High",
            description: "Develop technical leadership and team management skills",
            estimatedCost: "₹2,500",
          },
          {
            title: "Docker & Kubernetes",
            provider: "Udemy",
            duration: "6 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "Medium",
            description: "Master containerization and orchestration technologies",
            estimatedCost: "₹4,000",
          },
        ],
        5: [
          {
            title: "Software Architecture Patterns",
            provider: "O'Reilly Learning",
            duration: "10 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "High",
            description: "Master enterprise software architecture patterns and design",
            estimatedCost: "₹15,000",
          },
          {
            title: "Engineering Management",
            provider: "IIM Bangalore",
            duration: "12 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Transition from technical contributor to engineering manager",
            estimatedCost: "₹45,000",
          },
        ],
        6: [
          {
            title: "DevOps Engineering",
            provider: "AWS Training",
            duration: "8 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "High",
            description: "Master CI/CD, infrastructure as code, and DevOps practices",
            estimatedCost: "₹20,000",
          },
          {
            title: "Strategic Technology Planning",
            provider: "MIT xPRO",
            duration: "6 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "Medium",
            description: "Learn to align technology strategy with business objectives",
            estimatedCost: "₹75,000",
          },
        ],
        7: [
          {
            title: "Machine Learning for Engineers",
            provider: "Stanford Online",
            duration: "12 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "Medium",
            description: "Integrate ML capabilities into software systems",
            estimatedCost: "₹25,000",
          },
          {
            title: "Executive Leadership",
            provider: "ISB Hyderabad",
            duration: "8 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Develop executive presence and strategic leadership skills",
            estimatedCost: "₹85,000",
          },
        ],
        8: [
          {
            title: "Digital Transformation Strategy",
            provider: "Harvard Business School",
            duration: "6 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Lead digital transformation initiatives in organizations",
            estimatedCost: "₹1,20,000",
          },
          {
            title: "Emerging Technologies Trends",
            provider: "MIT Sloan",
            duration: "4 weeks",
            difficulty: "Advanced",
            type: "Industry-Specific",
            priority: "Medium",
            description: "Stay ahead of technology trends and innovations",
            estimatedCost: "₹60,000",
          },
        ],
        9: [
          {
            title: "Board Advisory Skills",
            provider: "Wharton Executive Education",
            duration: "3 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "Medium",
            description: "Prepare for board positions and advisory roles",
            estimatedCost: "₹1,50,000",
          },
          {
            title: "Innovation Management",
            provider: "Stanford Executive Program",
            duration: "5 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Drive innovation and R&D in technology organizations",
            estimatedCost: "₹2,00,000",
          },
        ],
        10: [
          {
            title: "CEO Leadership Program",
            provider: "Harvard Business School",
            duration: "4 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Executive leadership for C-suite positions",
            estimatedCost: "₹3,00,000",
          },
          {
            title: "Global Technology Trends",
            provider: "World Economic Forum",
            duration: "2 weeks",
            difficulty: "Advanced",
            type: "Industry-Specific",
            priority: "Medium",
            description: "Understand global technology landscape and future trends",
            estimatedCost: "₹1,00,000",
          },
        ],
      },
      "Data Scientist": {
        1: [
          {
            title: "Python for Data Science",
            provider: "Coursera",
            duration: "8 weeks",
            difficulty: "Beginner",
            type: "Technical",
            priority: "High",
            description: "Master Python programming for data analysis and visualization",
            estimatedCost: "₹3,000",
          },
          {
            title: "Statistics for Data Science",
            provider: "edX",
            duration: "10 weeks",
            difficulty: "Beginner",
            type: "Technical",
            priority: "High",
            description: "Build strong statistical foundations for data analysis",
            estimatedCost: "₹4,000",
          },
          {
            title: "SQL for Data Analysis",
            provider: "Udacity",
            duration: "6 weeks",
            difficulty: "Beginner",
            type: "Technical",
            priority: "High",
            description: "Learn SQL for data extraction and manipulation",
            estimatedCost: "₹5,000",
          },
        ],
        2: [
          {
            title: "Machine Learning Specialization",
            provider: "Coursera (Stanford)",
            duration: "12 weeks",
            difficulty: "Intermediate",
            type: "Technical",
            priority: "High",
            description: "Comprehensive machine learning algorithms and applications",
            estimatedCost: "₹8,000",
          },
          {
            title: "Data Visualization with Tableau",
            provider: "Tableau Learning",
            duration: "4 weeks",
            difficulty: "Intermediate",
            type: "Technical",
            priority: "High",
            description: "Create compelling data visualizations and dashboards",
            estimatedCost: "₹6,000",
          },
          {
            title: "Business Analytics",
            provider: "IIM Calcutta",
            duration: "8 weeks",
            difficulty: "Intermediate",
            type: "Industry-Specific",
            priority: "Medium",
            description: "Apply analytics to solve business problems",
            estimatedCost: "₹25,000",
          },
        ],
        3: [
          {
            title: "Deep Learning Specialization",
            provider: "Coursera (deeplearning.ai)",
            duration: "16 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "High",
            description: "Master neural networks and deep learning techniques",
            estimatedCost: "₹12,000",
          },
          {
            title: "Big Data with Spark",
            provider: "Databricks Academy",
            duration: "6 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "High",
            description: "Process large-scale data with Apache Spark",
            estimatedCost: "₹15,000",
          },
          {
            title: "Data Science Communication",
            provider: "LinkedIn Learning",
            duration: "3 weeks",
            difficulty: "Intermediate",
            type: "Soft Skills",
            priority: "Medium",
            description: "Present data insights effectively to stakeholders",
            estimatedCost: "₹2,500",
          },
        ],
        4: [
          {
            title: "MLOps Engineering",
            provider: "Google Cloud Training",
            duration: "8 weeks",
            difficulty: "Advanced",
            type: "Technical",
            priority: "High",
            description: "Deploy and manage ML models in production",
            estimatedCost: "₹18,000",
          },
          {
            title: "Advanced Analytics Leadership",
            provider: "Northwestern Kellogg",
            duration: "6 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Lead data science teams and analytics initiatives",
            estimatedCost: "₹65,000",
          },
        ],
        5: [
          {
            title: "AI Strategy and Governance",
            provider: "MIT Sloan",
            duration: "4 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Develop AI strategy and ethical AI practices",
            estimatedCost: "₹80,000",
          },
          {
            title: "Data Science Management",
            provider: "UC Berkeley",
            duration: "8 weeks",
            difficulty: "Advanced",
            type: "Leadership",
            priority: "High",
            description: "Manage data science teams and projects effectively",
            estimatedCost: "₹45,000",
          },
        ],
      },
    }

    const careerCourses = courseDatabase[career] || courseDatabase["Software Engineer"]
    return careerCourses[year] || careerCourses[Math.min(year, 5)] || []
  }

  private getCareerBaseData(career: string) {
    const careerDatabase: Record<string, any> = {
      "Software Engineer": {
        startingSalary: 600000,
        baseGrowthRate: 0.15,
        baseSatisfaction: 4.0,
        baseWorkLife: 3.5,
        baseBurnout: 2.5,
        description:
          "Software Engineers design, develop, and maintain software applications and systems that power the digital world.",
        industryOverview:
          "The software industry in India is experiencing explosive growth with increasing demand for skilled developers across startups and MNCs.",
        entryRequirements: [
          "Bachelor's in Computer Science or related field",
          "Programming skills in modern languages",
          "Problem-solving abilities",
          "Portfolio of projects",
        ],
        pros: [
          "High salary potential",
          "Remote work opportunities",
          "Continuous learning",
          "Global job market",
          "Innovation opportunities",
        ],
        cons: [
          "High competition",
          "Rapid technology changes",
          "Long working hours",
          "Deadline pressure",
          "Continuous upskilling required",
        ],
        recommendations: [
          "Master multiple programming languages",
          "Build a strong GitHub portfolio",
          "Contribute to open source projects",
          "Stay updated with latest technologies",
          "Develop soft skills for team collaboration",
        ],
      },
      "Data Scientist": {
        startingSalary: 700000,
        baseGrowthRate: 0.18,
        baseSatisfaction: 4.2,
        baseWorkLife: 3.8,
        baseBurnout: 2.3,
        description:
          "Data Scientists analyze complex data to extract insights that drive strategic business decisions and innovation.",
        industryOverview:
          "Data Science is one of the fastest-growing fields with massive demand across industries for data-driven decision making.",
        entryRequirements: [
          "Strong mathematics and statistics background",
          "Programming skills in Python/R",
          "Machine learning knowledge",
          "Business acumen",
        ],
        pros: [
          "Excellent salary growth",
          "High demand across industries",
          "Intellectual stimulation",
          "Impact on business decisions",
          "Remote work flexibility",
        ],
        cons: [
          "Requires continuous learning",
          "Data quality challenges",
          "Complex stakeholder management",
          "Long analysis cycles",
          "High expectations for insights",
        ],
        recommendations: [
          "Master statistical analysis and ML algorithms",
          "Develop domain expertise in specific industries",
          "Learn data visualization tools",
          "Build communication skills",
          "Create a portfolio of data projects",
        ],
      },
      "Product Manager": {
        startingSalary: 800000,
        baseGrowthRate: 0.16,
        baseSatisfaction: 4.1,
        baseWorkLife: 3.2,
        baseBurnout: 3.0,
        description:
          "Product Managers guide product development from conception to launch, balancing user needs with business objectives.",
        industryOverview:
          "Product Management is crucial in India's growing tech ecosystem with high demand for strategic product leaders.",
        entryRequirements: [
          "Business or technical background",
          "Strategic thinking abilities",
          "User empathy",
          "Communication skills",
          "Analytical mindset",
        ],
        pros: [
          "High strategic impact",
          "Cross-functional collaboration",
          "Business leadership opportunities",
          "Excellent compensation",
          "Career advancement potential",
        ],
        cons: [
          "High pressure and responsibility",
          "Balancing multiple stakeholders",
          "Long working hours",
          "Ambiguous success metrics",
          "Constant prioritization challenges",
        ],
        recommendations: [
          "Develop strong analytical and communication skills",
          "Learn user research methodologies",
          "Understand technical concepts",
          "Build relationships across teams",
          "Study successful product case studies",
        ],
      },
    }

    return careerDatabase[career] || careerDatabase["Software Engineer"]
  }

  private getJobTitle(career: string, year: number, hasHighGrowthTraits: boolean): string {
    const titleMaps: Record<string, string[]> = {
      "Software Engineer": [
        "Junior Software Developer",
        "Software Engineer",
        "Senior Software Engineer",
        "Lead Software Engineer",
        "Principal Engineer",
        "Engineering Manager",
        "Senior Engineering Manager",
        "Director of Engineering",
        "VP Engineering",
        "CTO",
      ],
      "Data Scientist": [
        "Data Analyst",
        "Junior Data Scientist",
        "Data Scientist",
        "Senior Data Scientist",
        "Lead Data Scientist",
        "Principal Data Scientist",
        "Data Science Manager",
        "Senior DS Manager",
        "Director of Data Science",
        "Chief Data Officer",
      ],
      "Product Manager": [
        "Associate Product Manager",
        "Product Manager",
        "Senior Product Manager",
        "Principal Product Manager",
        "Group Product Manager",
        "Director of Product",
        "Senior Director Product",
        "VP Product",
        "Chief Product Officer",
        "CEO",
      ],
    }

    const titles = titleMaps[career] || titleMaps["Software Engineer"]
    let index = Math.floor((year - 1) / 1.2)

    if (hasHighGrowthTraits) {
      index = Math.floor((year - 1) / 1.0) // Faster progression
    }

    return titles[Math.min(index, titles.length - 1)]
  }

  private getLifestyleDescription(career: string, year: number, workLifeBalance: number): string {
    const lifestyles = {
      early:
        workLifeBalance > 3.5
          ? "Balanced lifestyle with learning opportunities and moderate work hours"
          : "Intense learning phase with longer hours but exciting growth opportunities",
      mid:
        workLifeBalance > 3.5
          ? "Established routine with good work-life balance and increased responsibilities"
          : "High-responsibility phase with challenging projects and leadership opportunities",
      senior:
        workLifeBalance > 3.5
          ? "Strategic role with flexible schedule and focus on mentoring others"
          : "Executive responsibilities with high impact decisions and significant influence",
    }

    if (year <= 3) return lifestyles.early
    if (year <= 7) return lifestyles.mid
    return lifestyles.senior
  }

  private getMilestone(career: string, year: number): string {
    const milestones = [
      "Successfully completed onboarding and first project delivery",
      "Received positive performance review and salary increment",
      "Led first independent project and mentored junior colleague",
      "Promoted to senior role with increased responsibilities",
      "Completed advanced certification and expanded skill set",
      "Successfully delivered major project with significant business impact",
      "Recognized as subject matter expert and thought leader",
      "Built and led high-performing team to achieve ambitious goals",
      "Drove strategic initiatives with company-wide impact",
      "Achieved senior leadership position with industry recognition",
    ]
    return milestones[year - 1] || "Continued professional excellence and growth"
  }

  private getSkillsRequired(career: string, year: number): string[] {
    const skillMaps: Record<string, string[][]> = {
      "Software Engineer": [
        ["Programming Fundamentals", "Version Control", "Debugging"],
        ["Framework Proficiency", "Database Design", "Testing"],
        ["System Design", "Code Review", "Mentoring"],
        ["Architecture Planning", "Team Leadership", "Project Management"],
        ["Strategic Planning", "Technology Evaluation", "Stakeholder Management"],
      ],
      "Data Scientist": [
        ["Statistics", "Python/R", "Data Visualization"],
        ["Machine Learning", "SQL", "Business Intelligence"],
        ["Advanced ML", "Big Data Tools", "A/B Testing"],
        ["MLOps", "Team Leadership", "Strategy Development"],
        ["Executive Communication", "Data Strategy", "Innovation Leadership"],
      ],
    }

    const skills = skillMaps[career] || skillMaps["Software Engineer"]
    const index = Math.min(Math.floor((year - 1) / 2), skills.length - 1)
    return skills[index] || []
  }

  private getChallenges(career: string, year: number): string[] {
    const challengesByPhase = [
      ["Learning curve", "Adapting to work culture"],
      ["Increased complexity", "Time management"],
      ["Leadership responsibilities", "Technical depth vs breadth"],
      ["Strategic thinking", "Managing larger teams"],
      ["Industry changes", "Succession planning"],
    ]

    const index = Math.min(Math.floor((year - 1) / 2), challengesByPhase.length - 1)
    return challengesByPhase[index] || []
  }

  private getOpportunities(career: string, year: number): string[] {
    const opportunitiesByPhase = [
      ["Skill development", "Network building"],
      ["Specialization", "Cross-team collaboration"],
      ["Leadership roles", "Industry recognition"],
      ["Strategic influence", "Mentoring others"],
      ["Industry leadership", "Board positions"],
    ]

    const index = Math.min(Math.floor((year - 1) / 2), opportunitiesByPhase.length - 1)
    return opportunitiesByPhase[index] || []
  }
}

export const geminiSimulator = new GeminiCareerSimulator()
