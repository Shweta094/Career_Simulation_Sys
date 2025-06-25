"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  TrendingUp,
  DollarSign,
  Heart,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import CareerReportGenerator, { type ReportData } from "@/utils/report-generator"

interface SimulationResultsProps {
  userData: any
  onBack: () => void
}

export default function SimulationResults({ userData, onBack }: SimulationResultsProps) {
  const [simulations, setSimulations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCareer, setActiveCareer] = useState(0)

  useEffect(() => {
    // Simulate GPT API call and generate career simulations
    const generateSimulations = () => {
      setLoading(true)

      const mockSimulations = userData.selectedCareers.map((career: string) => {
        const yearlyData = []
        let baseSalary = 600000 // 6 LPA base

        // Use selected traits for simulation customization
        const hasHighGrowthTraits = userData.selectedTraits?.some((trait: string) =>
          ["Leadership", "Strategic", "Entrepreneurial", "Innovative"].includes(trait),
        )

        const hasStabilityTraits = userData.selectedTraits?.some((trait: string) =>
          ["Organized", "Detail-oriented", "Process-oriented", "Quality-focused"].includes(trait),
        )

        for (let year = 1; year <= 10; year++) {
          // Adjust salary growth based on traits
          let salaryGrowth = Math.random() * 0.15 + 0.05 // 5-20% base growth

          if (hasHighGrowthTraits) {
            salaryGrowth *= 1.2 // 20% bonus for high-growth traits
          }

          baseSalary *= 1 + salaryGrowth

          // Adjust satisfaction based on traits alignment
          let satisfaction = 3.0
          if (hasStabilityTraits && year > 3) {
            satisfaction += 0.5 // Higher satisfaction for stability-oriented people in later years
          }
          if (hasHighGrowthTraits && year <= 5) {
            satisfaction += 0.3 // Higher satisfaction for growth-oriented people in early years
          }

          satisfaction = Math.max(1, Math.min(5, satisfaction + Math.random() * 2 - 1))

          yearlyData.push({
            year: `Year ${year}`,
            yearNum: year,
            salary: Math.round(baseSalary),
            satisfaction: Math.round(satisfaction * 10) / 10,
            title: getJobTitle(career, year),
            milestone: getMilestone(year),
          })
        }

        return {
          career,
          description: getCareerDescription(career),
          yearlyData,
          summary: {
            avgSalary: Math.round(yearlyData.reduce((sum, y) => sum + y.salary, 0) / 10),
            avgSatisfaction: Math.round((yearlyData.reduce((sum, y) => sum + y.satisfaction, 0) / 10) * 10) / 10,
            peakSalary: Math.max(...yearlyData.map((y) => y.salary)),
            careerProgression: yearlyData[9].title,
          },
        }
      })

      setSimulations(mockSimulations)
      setLoading(false)
    }

    setTimeout(generateSimulations, 2000)
  }, [userData])

  const getJobTitle = (career: string, year: number) => {
    const titles = {
      "Software Engineer": [
        "Junior Developer",
        "Software Engineer",
        "Senior Engineer",
        "Lead Engineer",
        "Principal Engineer",
      ],
      "Data Scientist": [
        "Data Analyst",
        "Data Scientist",
        "Senior Data Scientist",
        "Lead Data Scientist",
        "Principal Data Scientist",
      ],
      "Product Manager": ["Associate PM", "Product Manager", "Senior PM", "Principal PM", "VP Product"],
      "UX Designer": ["Junior Designer", "UX Designer", "Senior Designer", "Lead Designer", "Design Director"],
      "Marketing Manager": [
        "Marketing Associate",
        "Marketing Manager",
        "Senior Manager",
        "Marketing Director",
        "VP Marketing",
      ],
      "Financial Analyst": [
        "Junior Analyst",
        "Financial Analyst",
        "Senior Analyst",
        "Finance Manager",
        "Finance Director",
      ],
    }

    const careerTitles = titles[career as keyof typeof titles] || ["Junior", "Associate", "Senior", "Lead", "Director"]
    const index = Math.min(Math.floor((year - 1) / 2), careerTitles.length - 1)
    return careerTitles[index]
  }

  const getMilestone = (year: number) => {
    const milestones = [
      "Completed onboarding and first project",
      "Received first performance review",
      "Led a small team initiative",
      "Promoted to senior role",
      "Completed advanced certification",
      "Managed major project delivery",
      "Recognized as subject matter expert",
      "Mentored junior team members",
      "Led cross-functional initiatives",
      "Achieved leadership position",
    ]
    return milestones[year - 1] || "Continued professional growth"
  }

  const getCareerDescription = (career: string) => {
    const descriptions = {
      "Software Engineer": "Build innovative software solutions that power the digital world.",
      "Data Scientist": "Unlock insights from data to drive strategic business decisions.",
      "Product Manager": "Shape product vision and guide development from concept to market.",
      "UX Designer": "Create intuitive experiences that delight users and solve real problems.",
      "Marketing Manager": "Drive brand growth and customer engagement through strategic campaigns.",
      "Financial Analyst": "Analyze financial data to guide investment and business strategies.",
    }
    return descriptions[career as keyof typeof descriptions] || "Pursue a rewarding career path."
  }

  const getRadarData = () => {
    const attributes = ["Salary", "Growth", "Satisfaction", "Stability", "Innovation"]
    return attributes.map((attr) => {
      const dataPoint = { attribute: attr }
      simulations.forEach((sim, index) => {
        let value = 0
        switch (attr) {
          case "Salary":
            value = Math.min(100, (sim.summary.avgSalary / 2000000) * 100)
            break
          case "Growth":
            value = Math.min(100, ((sim.summary.peakSalary - sim.yearlyData[0].salary) / sim.yearlyData[0].salary) * 10)
            break
          case "Satisfaction":
            value = (sim.summary.avgSatisfaction / 5) * 100
            break
          case "Stability":
            value = Math.random() * 40 + 60 // Mock stability score
            break
          case "Innovation":
            value = Math.random() * 50 + 50 // Mock innovation score
            break
        }
        dataPoint[`career${index}`] = Math.round(value)
      })
      return dataPoint
    })
  }

  const getCareerStrengths = (simulation) => {
    const strengths = []
    if (simulation.summary.avgSalary > 1200000) strengths.push("High earning potential")
    if (simulation.summary.avgSatisfaction > 4) strengths.push("High job satisfaction")
    if (simulation.summary.peakSalary > 2000000) strengths.push("Excellent growth trajectory")
    strengths.push("Strong market demand")
    strengths.push("Clear career progression path")
    return strengths
  }

  const getCareerConsiderations = (simulation) => {
    const considerations = []
    if (simulation.summary.avgSalary < 800000) considerations.push("Lower initial compensation")
    considerations.push("Requires continuous skill development")
    considerations.push("Market competition")
    if (simulation.career.includes("Engineer")) considerations.push("Technical complexity")
    considerations.push("Industry volatility factors")
    return considerations
  }

  const getBestOverallMatch = () => {
    const best = simulations.reduce((prev, current) =>
      prev.summary.avgSatisfaction > current.summary.avgSatisfaction ? prev : current,
    )
    return `${best.career} offers the best balance of satisfaction (${best.summary.avgSatisfaction}/5) and growth potential based on your profile.`
  }

  const getHighestGrowthCareer = () => {
    const highest = simulations.reduce((prev, current) =>
      prev.summary.peakSalary > current.summary.peakSalary ? prev : current,
    )
    return `${highest.career} shows the highest earning potential with peak salary of ₹${(highest.summary.peakSalary / 100000).toFixed(1)}L.`
  }

  const getBestWorkLifeBalance = () => {
    // Mock work-life balance scoring
    const balanced = simulations[Math.floor(Math.random() * simulations.length)]
    return `${balanced.career} typically offers better work-life balance with flexible working arrangements.`
  }

  const downloadReport = () => {
    const reportData: ReportData = {
      userProfile: {
        name: userData.name || "Career Seeker",
        traits: userData.selectedTraits || [],
        skills: userData.skills || [],
        interests: userData.interests || [],
      },
      careerSimulations: simulations,
      comparativeAnalysis: {
        bestOverallMatch: getBestOverallMatch(),
        highestGrowth: getHighestGrowthCareer(),
        bestWorkLife: getBestWorkLifeBalance(),
        radarData: getRadarData(),
      },
      generatedAt: new Date().toISOString(),
    }

    // Download the comprehensive report
    CareerReportGenerator.downloadReport(reportData)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Generating Your Career Simulations</h3>
            <p className="text-gray-600">Creating personalized 10-year projections...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentSimulation = simulations[activeCareer]

  return (
    <div className="space-y-6">
      {/* Career Selection and Comparison Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Career Simulations</CardTitle>
          <p className="text-gray-600">Explore 10-year projections and compare your selected careers</p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeCareer === -1 ? "comparison" : activeCareer.toString()}
            onValueChange={(value) => setActiveCareer(value === "comparison" ? -1 : Number.parseInt(value))}
          >
            <TabsList className="grid w-full grid-cols-4">
              {simulations.map((sim, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  {sim.career}
                </TabsTrigger>
              ))}
              <TabsTrigger value="comparison">
                <BarChart3 className="h-4 w-4 mr-1" />
                Compare All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comparative Analysis */}
      {activeCareer === -1 && (
        <div className="space-y-6">
          {/* Comparison Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Career Comparison Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Career</th>
                      <th className="text-center p-3 font-medium">Avg Salary</th>
                      <th className="text-center p-3 font-medium">Peak Salary</th>
                      <th className="text-center p-3 font-medium">Satisfaction</th>
                      <th className="text-center p-3 font-medium">Growth Rate</th>
                      <th className="text-center p-3 font-medium">Final Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulations.map((sim, index) => {
                      const growthRate = (
                        ((sim.summary.peakSalary - sim.yearlyData[0].salary) / sim.yearlyData[0].salary) *
                        100
                      ).toFixed(1)
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{sim.career}</td>
                          <td className="p-3 text-center">₹{(sim.summary.avgSalary / 100000).toFixed(1)}L</td>
                          <td className="p-3 text-center">₹{(sim.summary.peakSalary / 100000).toFixed(1)}L</td>
                          <td className="p-3 text-center">{sim.summary.avgSatisfaction}/5</td>
                          <td className="p-3 text-center">{growthRate}%</td>
                          <td className="p-3 text-center text-sm">{sim.summary.careerProgression}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Comparative Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Comparison (10-Year)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Tooltip formatter={(value) => [`₹${((value as number) / 100000).toFixed(1)}L`, "Salary"]} />
                    {simulations.map((sim, index) => (
                      <Line
                        key={index}
                        type="monotone"
                        dataKey="salary"
                        data={sim.yearlyData}
                        stroke={["#2563eb", "#dc2626", "#16a34a"][index]}
                        strokeWidth={2}
                        name={sim.career}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Attributes Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {simulations.map((sim, index) => (
                      <Radar
                        key={index}
                        name={sim.career}
                        dataKey={`career${index}`}
                        stroke={["#2563eb", "#dc2626", "#16a34a"][index]}
                        fill={["#2563eb", "#dc2626", "#16a34a"][index]}
                        fillOpacity={0.1}
                      />
                    ))}
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pros and Cons Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Career Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {simulations.map((sim, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4">{sim.career}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Strengths
                        </h4>
                        <ul className="text-sm space-y-1">
                          {getCareerStrengths(sim).map((strength, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Considerations
                        </h4>
                        <ul className="text-sm space-y-1">
                          {getCareerConsiderations(sim).map((consideration, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-600 mt-1">•</span>
                              {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                AI Recommendation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Best Overall Match</h4>
                  <p className="text-blue-800">{getBestOverallMatch()}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Highest Growth Potential</h4>
                  <p className="text-green-800">{getHighestGrowthCareer()}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-900 mb-2">Best Work-Life Balance</h4>
                  <p className="text-purple-800">{getBestWorkLifeBalance()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Career Simulation */}
      {currentSimulation && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Salary</p>
                    <p className="text-lg font-semibold">
                      ₹{(currentSimulation.summary.avgSalary / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Peak Salary</p>
                    <p className="text-lg font-semibold">
                      ₹{(currentSimulation.summary.peakSalary / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Satisfaction</p>
                    <p className="text-lg font-semibold">{currentSimulation.summary.avgSatisfaction}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Final Role</p>
                    <p className="text-sm font-semibold">{currentSimulation.summary.careerProgression}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={currentSimulation.yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Tooltip formatter={(value) => [`₹${((value as number) / 100000).toFixed(1)}L`, "Salary"]} />
                    <Line type="monotone" dataKey="salary" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentSimulation.yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => [`${value}/5`, "Satisfaction"]} />
                    <Bar dataKey="satisfaction" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Year-by-Year Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>10-Year Career Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSimulation.yearlyData.map((year: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{year.year}</Badge>
                        <div>
                          <h4 className="font-medium">{year.title}</h4>
                          <p className="text-sm text-gray-600">{year.milestone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(year.salary / 100000).toFixed(1)}L</p>
                      <p className="text-sm text-gray-600">Satisfaction: {year.satisfaction}/5</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Matching
        </Button>

        <Button onClick={downloadReport}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  )
}
