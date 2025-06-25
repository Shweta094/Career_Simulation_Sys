"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Heart,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Clock,
  BookOpen,
  Award,
  Target,
  Users,
  Lightbulb,
  ExternalLink,
  FileText,
  CheckCircle,
  Info,
} from "lucide-react"
import {
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
  ComposedChart,
} from "recharts"
import { geminiSimulator, type CareerSimulation, type CareerSimulationRequest } from "@/lib/gemini-client"
// Remove these imports at the top:
// import CareerReportGenerator, { type ReportData } from "@/utils/report-generator"

const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-area, .print-area * {
      visibility: visible;
    }
    .print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
    .print-break {
      page-break-before: always;
    }
    .print-avoid-break {
      page-break-inside: avoid;
    }
  }
`

interface EnhancedSimulationResultsProps {
  userData: any
  onBack: () => void
}

export default function EnhancedSimulationResults({ userData, onBack }: EnhancedSimulationResultsProps) {
  const [simulations, setSimulations] = useState<CareerSimulation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCareer, setActiveCareer] = useState(0)
  // Replace the downloadingPDF state with:
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    generateAISimulations()

    const styleSheet = document.createElement("style")
    styleSheet.innerText = printStyles
    document.head.appendChild(styleSheet)

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [userData])

  const generateAISimulations = async () => {
    setLoading(true)

    try {
      const requests: CareerSimulationRequest[] = userData.selectedCareers.map((career: string) => ({
        career,
        userProfile: {
          name: userData.name || "Career Seeker",
          age: userData.age || 25,
          selectedTraits: userData.selectedTraits || [],
          skills: userData.skills || [],
          interests: userData.interests || [],
          values: userData.values || {},
          decisionAnswers: userData.decisionAnswers || {},
        },
      }))

      console.log("🚀 Starting career simulation generation...")
      const results = await geminiSimulator.generateMultipleSimulations(requests)

      setSimulations(results)
      console.log("✅ Career simulations generated successfully")
    } catch (error) {
      console.error("❌ Error generating simulations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGenerationMethodBadge = (method: string) => {
    switch (method) {
      case "gemini-flash":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Gemini Flash</Badge>
      case "enhanced-mock":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Enhanced Mock</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getGenerationStatusAlert = () => {
    const methods = simulations.map((s) => s.generationMethod)
    const hasAI = methods.some((m) => m === "gemini-flash")
    const allMock = methods.every((m) => m === "enhanced-mock")

    if (allMock) {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Enhanced Mock Data:</strong> Using sophisticated algorithms for realistic career projections. To
            enable AI-powered simulations, add your Gemini API key to environment variables.
          </AlertDescription>
        </Alert>
      )
    } else if (hasAI) {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>AI-Powered Simulations:</strong> Successfully generated using Google's Gemini Flash AI model for
            personalized career projections and course recommendations.
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  // Replace the downloadPDFReport function with:
  const printReport = () => {
    window.print()
  }

  const getRadarData = () => {
    const attributes = ["Salary", "Growth", "Satisfaction", "Stability", "Innovation", "Work-Life Balance"]
    return attributes.map((attr) => {
      const dataPoint: any = { attribute: attr }
      simulations.forEach((sim, index) => {
        let value = 0
        switch (attr) {
          case "Salary":
            value = Math.min(100, (sim.summary.avgSalary / 2000000) * 100)
            break
          case "Growth":
            value = Math.min(
              100,
              ((sim.summary.peakSalary - sim.yearlyProjections[0].salary) / sim.yearlyProjections[0].salary) * 10,
            )
            break
          case "Satisfaction":
            value = (sim.summary.avgSatisfaction / 5) * 100
            break
          case "Stability":
            value = Math.max(0, 100 - (sim.summary.avgBurnoutRisk / 5) * 100)
            break
          case "Innovation":
            const innovationScore = sim.career.includes("Engineer") ? 85 : sim.career.includes("Data") ? 90 : 75
            value = innovationScore + Math.random() * 10 - 5
            break
          case "Work-Life Balance":
            value = (sim.summary.avgWorkLifeBalance / 5) * 100
            break
        }
        const careerName = sim.career.length > 15 ? sim.career.substring(0, 12) + "..." : sim.career
        dataPoint[careerName] = Math.round(Math.max(0, Math.min(100, value)))
      })
      return dataPoint
    })
  }

  const getBurnoutWorkLifeData = () => {
    return simulations.map((sim, index) => ({
      career: sim.career.length > 10 ? sim.career.substring(0, 8) + "..." : sim.career,
      burnoutRisk: sim.summary.avgBurnoutRisk,
      workLifeBalance: sim.summary.avgWorkLifeBalance,
      satisfaction: sim.summary.avgSatisfaction,
    }))
  }

  const getSalaryGrowthData = () => {
    return simulations.map((sim) => ({
      career: sim.career.length > 10 ? sim.career.substring(0, 8) + "..." : sim.career,
      avgSalary: Math.round(sim.summary.avgSalary / 100000),
      peakSalary: Math.round(sim.summary.peakSalary / 100000),
    }))
  }

  const getCareerProgressionData = (simulation: CareerSimulation) => {
    return simulation.yearlyProjections.map((year) => ({
      year: `Y${year.year}`,
      salary: Math.round(year.salary / 100000),
      satisfaction: year.satisfaction,
      workLifeBalance: year.workLifeBalance,
      burnoutRisk: year.burnoutRisk,
    }))
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
    const balanced = simulations.reduce((prev, current) =>
      prev.summary.avgWorkLifeBalance > current.summary.avgWorkLifeBalance ? prev : current,
    )
    return `${balanced.career} typically offers better work-life balance with an average score of ${balanced.summary.avgWorkLifeBalance}/5.`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Technical":
        return <Zap className="h-4 w-4" />
      case "Soft Skills":
        return <Users className="h-4 w-4" />
      case "Certification":
        return <Award className="h-4 w-4" />
      case "Leadership":
        return <Target className="h-4 w-4" />
      case "Industry-Specific":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Generating Your AI-Powered Career Simulations</h3>
            <p className="text-gray-600">Creating personalized 10-year projections with course recommendations...</p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>• Attempting Gemini Flash generation...</p>
              <p>• Enhanced mock data as fallback option...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentSimulation = simulations[activeCareer]

  return (
    <div className="print-area">
      {/* Generation Status Alert */}
      {getGenerationStatusAlert()}

      {/* Career Selection and Comparison Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Your Career Simulations with Learning Pathways
              </CardTitle>
              <p className="text-gray-600">
                Explore 10-year projections with detailed course recommendations for each career
              </p>
            </div>
            <div className="flex gap-2">
              {simulations.map((sim, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500">{sim.career}</p>
                  {getGenerationMethodBadge(sim.generationMethod)}
                </div>
              ))}
            </div>
          </div>
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
          {/* Multi-Metric Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Multi-Metric Career Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: "400px" }} data-chart="radar">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {simulations.map((sim, index) => {
                      const careerName = sim.career.length > 15 ? sim.career.substring(0, 12) + "..." : sim.career
                      return (
                        <Radar
                          key={index}
                          name={careerName}
                          dataKey={careerName}
                          stroke={["#2563eb", "#dc2626", "#16a34a", "#f59e0b"][index]}
                          fill={["#2563eb", "#dc2626", "#16a34a", "#f59e0b"][index]}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      )
                    })}
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Burnout vs Work-Life Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Burnout Risk vs Work-Life Balance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: "300px" }} data-chart="burnout">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getBurnoutWorkLifeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="career" />
                    <YAxis yAxisId="left" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="burnoutRisk" fill="#ef4444" name="Burnout Risk" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="workLifeBalance"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Work-Life Balance"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Salary Growth Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Salary Growth Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: "300px" }} data-chart="salary">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getSalaryGrowthData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="career" />
                    <YAxis tickFormatter={(value) => `₹${value}L`} />
                    <Tooltip formatter={(value) => [`₹${value}L`, ""]} />
                    <Bar dataKey="avgSalary" fill="#3b82f6" name="Average Salary" />
                    <Bar dataKey="peakSalary" fill="#1d4ed8" name="Peak Salary" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Individual Career Analysis */}
      {currentSimulation && (
        <div className="space-y-6">
          {/* Career Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {currentSimulation.career} - Career Journey
                {getGenerationMethodBadge(currentSimulation.generationMethod)}
              </CardTitle>
              <p className="text-gray-600">{currentSimulation.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Avg Salary</p>
                  <p className="text-lg font-semibold">₹{(currentSimulation.summary.avgSalary / 100000).toFixed(1)}L</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Peak Salary</p>
                  <p className="text-lg font-semibold">
                    ₹{(currentSimulation.summary.peakSalary / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="text-lg font-semibold">{currentSimulation.summary.avgSatisfaction}/5</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-lg font-semibold">{currentSimulation.summary.totalGrowth}</p>
                </div>
              </div>

              {/* Career Progression Chart */}
              <div style={{ width: "100%", height: "300px" }} data-chart="progression">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getCareerProgressionData(currentSimulation)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `₹${value}L`} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="salary" fill="#3b82f6" name="Salary (₹L)" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Satisfaction"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="workLifeBalance"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Work-Life Balance"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Year-by-Year Journey with Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                10-Year Learning & Career Journey
              </CardTitle>
              <p className="text-gray-600">Detailed progression with recommended courses for each year</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentSimulation.yearlyProjections.map((year, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            Year {year.year}
                          </Badge>
                          <h3 className="text-xl font-semibold">{year.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{year.keyMilestone}</p>
                        <p className="text-sm text-gray-500">{year.lifestyle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">₹{(year.salary / 100000).toFixed(1)}L</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">Satisfaction: {year.satisfaction}/5</Badge>
                          <Badge variant="secondary">Work-Life: {year.workLifeBalance}/5</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Skills, Challenges, Opportunities */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Skills Required
                        </h4>
                        <ul className="text-sm space-y-1">
                          {(year.skillsRequired || []).map((skill, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Challenges
                        </h4>
                        <ul className="text-sm space-y-1">
                          {(year.challenges || []).map((challenge, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Opportunities
                        </h4>
                        <ul className="text-sm space-y-1">
                          {(year.opportunities || []).map((opportunity, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommended Courses */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-purple-700 mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Recommended Courses for Year {year.year}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(year.recommendedCourses || []).map((course, courseIndex) => (
                          <div key={courseIndex} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(course.type)}
                                <h5 className="font-medium text-gray-900">{course.title}</h5>
                              </div>
                              <Badge className={getPriorityColor(course.priority)}>{course.priority}</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  {course.provider}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {course.duration}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-xs">
                                  {course.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {course.type}
                                </Badge>
                                <span className="text-green-600 font-medium">{course.estimatedCost}</span>
                              </div>
                              <p className="text-gray-600">{course.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pros, Cons, and Recommendations */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(currentSimulation.pros || []).map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(currentSimulation.cons || []).map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(currentSimulation.recommendations || []).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 no-print">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment
        </Button>
        <Button onClick={printReport} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Print Report
        </Button>
      </div>
    </div>
  )
}
