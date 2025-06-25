import careerOntology from "@/data/career-ontology.json"

export interface CareerData {
  traits: string[]
  salary: [number, number]
  work_env: string
  growth: string
  locations: string[]
  demand_score: number
  nsdc_trainings: number
  rank: number
}

export interface UserProfile {
  selectedTraits: string[] // Replace personality with selectedTraits
  skills: string[]
  interests: string[]
  values: Record<string, number[]>
  decisionAnswers: Record<string, string>
}

export interface CareerMatch {
  career: string
  data: CareerData
  match_score: number
  match_percentage: number
  match_reasons: string[]
}

// Domain to career mapping
const domainCareerMap: Record<string, string[]> = {
  technology: [
    "Software Engineer",
    "AI/ML Engineer",
    "Data Scientist",
    "UX Designer",
    "Cybersecurity Specialist",
    "Blockchain Developer",
    "Cloud Architect",
  ],
  healthcare: [
    "Doctor (MBBS)",
    "Telemedicine Doctor",
    "Medical Robotics Engineer",
    "Healthcare Data Analyst",
    "Clinical Research Associate",
  ],
  business: [
    "Chartered Accountant",
    "Banking & Finance Analyst",
    "Digital Marketer",
    "Product Manager",
    "Marketing Manager",
  ],
  creative: [
    "UX Designer",
    "Graphic Designer",
    "VFX Artist",
    "Game Developer",
    "Fashion Technologist",
    "Creative Writer",
  ],
  education: ["Puppetry-Based Educator", "Youth AI Ethics Educator", "Sanskrit AI Linguist"],
  social: ["Civil Services (IAS/IPS)", "Disaster Management Specialist", "Urban Planner"],
}

export function calculateCareerMatches(userProfile: UserProfile): CareerMatch[] {
  const matches: CareerMatch[] = []

  // Use selected traits directly instead of mapping from personality
  const userTraits = userProfile.selectedTraits.map((trait) => trait.toLowerCase())

  // Get preferred domain careers
  const preferredDomain = userProfile.decisionAnswers.domain
  const domainCareers = preferredDomain ? domainCareerMap[preferredDomain] || [] : []

  // Get work environment preference
  const workEnvPreference = userProfile.decisionAnswers.environment

  // Get growth preference
  const growthPreference = userProfile.decisionAnswers.growth

  // Get work-life balance preference
  const workLifePreference = userProfile.decisionAnswers.worklife

  // Get risk tolerance
  const riskTolerance = userProfile.decisionAnswers.risk

  Object.entries(careerOntology).forEach(([careerName, careerData]) => {
    let score = 0
    const matchReasons: string[] = []

    // 1. Trait matching (35% weight - increased since it's now primary)
    const careerTraitsLower = careerData.traits.map((trait) => trait.toLowerCase())
    const traitMatches = userTraits.filter((userTrait) =>
      careerTraitsLower.some(
        (careerTrait) =>
          careerTrait.includes(userTrait) ||
          userTrait.includes(careerTrait) ||
          // Add fuzzy matching for similar traits
          (userTrait === "logical" && careerTrait === "analytical") ||
          (userTrait === "creative" && careerTrait === "innovative") ||
          (userTrait === "communicative" && careerTrait === "collaborative"),
      ),
    )

    const traitScore = traitMatches.length / Math.max(userTraits.length, careerTraitsLower.length)
    score += traitScore * 0.35

    if (traitMatches.length > 0) {
      matchReasons.push(`Strong trait alignment: ${traitMatches.length} matching traits`)
    }

    // Rest of the matching logic remains the same but with adjusted weights
    // 2. Domain preference (25% weight)
    if (domainCareers.includes(careerName)) {
      score += 0.25
      matchReasons.push(`Matches your ${preferredDomain} interest`)
    }

    // 3. Work environment matching (15% weight)
    if (workEnvPreference && careerData.work_env) {
      const envMatch = checkEnvironmentMatch(workEnvPreference, careerData.work_env)
      if (envMatch) {
        score += 0.15
        matchReasons.push(`Suitable work environment`)
      }
    }

    // 4. Growth potential matching (10% weight)
    if (growthPreference && careerData.growth) {
      const growthMatch = checkGrowthMatch(growthPreference, careerData.growth)
      if (growthMatch) {
        score += 0.1
        matchReasons.push(`Matches growth expectations`)
      }
    }

    // 5. Demand score bonus (10% weight)
    const demandBonus = (careerData.demand_score / 10) * 0.1
    score += demandBonus

    // 6. Salary preference (5% weight)
    const salaryImportance = userProfile.values.salary?.[0] || 50
    if (salaryImportance > 70 && careerData.salary[1] > 1000000) {
      score += 0.05
      matchReasons.push(`High earning potential`)
    }

    // 7. Work-life balance consideration (5% weight)
    if (
      workLifePreference === "strict" &&
      (careerData.work_env.includes("Remote") || careerData.work_env.includes("Hybrid"))
    ) {
      score += 0.05
      matchReasons.push(`Good work-life balance`)
    }

    // Normalize score to 0-1 range
    score = Math.min(score, 1)

    matches.push({
      career: careerName,
      data: careerData,
      match_score: score,
      match_percentage: Math.round(score * 100),
      match_reasons: matchReasons,
    })
  })

  // Sort by match score and return top matches
  return matches.sort((a, b) => b.match_score - a.match_score).slice(0, 20)
}

function checkEnvironmentMatch(preference: string, careerEnv: string): boolean {
  const envMap: Record<string, string[]> = {
    office: ["Office", "Corporate", "Hospital", "Clinic"],
    remote: ["Remote", "Freelance"],
    hybrid: ["Hybrid", "Office/Remote", "Office/Hybrid"],
    field: ["Field", "On-site", "Manufacturing"],
    lab: ["Lab", "Research"],
    client: ["Consulting", "Client"],
  }

  const preferredEnvs = envMap[preference] || []
  return preferredEnvs.some((env) => careerEnv.includes(env))
}

function checkGrowthMatch(preference: string, careerGrowth: string): boolean {
  const growthMap: Record<string, string[]> = {
    "very-high": ["Explosive"],
    high: ["High", "Explosive"],
    moderate: ["Moderate", "High"],
    low: ["Stable", "Moderate", "Low"],
  }

  const acceptableGrowth = growthMap[preference] || []
  return acceptableGrowth.includes(careerGrowth)
}

export function formatSalary(salary: [number, number]): string {
  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`
    }
  }

  return `${formatAmount(salary[0])} - ${formatAmount(salary[1])}`
}

export function getGrowthColor(growth: string): string {
  switch (growth) {
    case "Explosive":
      return "text-red-600"
    case "High":
      return "text-green-600"
    case "Moderate":
      return "text-blue-600"
    case "Stable":
      return "text-gray-600"
    case "Low":
      return "text-gray-500"
    default:
      return "text-gray-600"
  }
}

export function getDemandColor(score: number): string {
  if (score >= 9) return "text-red-600"
  if (score >= 8) return "text-orange-600"
  if (score >= 7) return "text-yellow-600"
  if (score >= 6) return "text-green-600"
  return "text-gray-600"
}
