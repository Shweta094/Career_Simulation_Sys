"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Briefcase, TrendingUp, MapPin, Search, Star, Users, DollarSign } from "lucide-react"
import {
  calculateCareerMatches,
  formatSalary,
  getGrowthColor,
  getDemandColor,
  type CareerMatch,
} from "@/utils/career-matching"

interface CareerMatchingProps {
  userData: any
  onNext: (data: any) => void
  onBack: () => void
}

export default function CareerMatching({ userData, onNext, onBack }: CareerMatchingProps) {
  const [allMatches, setAllMatches] = useState<CareerMatch[]>([])
  const [filteredMatches, setFilteredMatches] = useState<CareerMatch[]>([])
  const [selectedCareers, setSelectedCareers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    growth: "",
    workEnv: "",
    salaryRange: "",
  })

  useEffect(() => {
    const matchCareers = () => {
      setLoading(true)

      // Use the real ontology matching algorithm
      const matches = calculateCareerMatches(userData)
      setAllMatches(matches)
      setFilteredMatches(matches.slice(0, 12)) // Show top 12 initially
      setLoading(false)
    }

    setTimeout(matchCareers, 1500) // Simulate processing time
  }, [userData])

  useEffect(() => {
    // Filter matches based on search and filters
    let filtered = allMatches

    // Search filter - now includes traits
    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.career.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.data.traits.some((trait) => trait.toLowerCase().includes(searchTerm.toLowerCase())) ||
          // Also search in user's selected traits for better matching
          userData.selectedTraits?.some((userTrait) => userTrait.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Growth filter
    if (selectedFilters.growth) {
      filtered = filtered.filter((match) => match.data.growth === selectedFilters.growth)
    }

    // Work environment filter
    if (selectedFilters.workEnv) {
      filtered = filtered.filter((match) =>
        match.data.work_env.toLowerCase().includes(selectedFilters.workEnv.toLowerCase()),
      )
    }

    // Salary range filter
    if (selectedFilters.salaryRange) {
      filtered = filtered.filter((match) => {
        const maxSalary = match.data.salary[1]
        switch (selectedFilters.salaryRange) {
          case "high":
            return maxSalary >= 1500000
          case "medium":
            return maxSalary >= 800000 && maxSalary < 1500000
          case "entry":
            return maxSalary < 800000
          default:
            return true
        }
      })
    }

    setFilteredMatches(filtered.slice(0, 12))
  }, [searchTerm, selectedFilters, allMatches, userData.selectedTraits])

  const handleCareerSelect = (career: string) => {
    setSelectedCareers((prev) =>
      prev.includes(career) ? prev.filter((c) => c !== career) : prev.length < 3 ? [...prev, career] : prev,
    )
  }

  const handleNext = () => {
    onNext({ selectedCareers, careerMatches: allMatches })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Analyzing 300+ Career Options</h3>
            <p className="text-gray-600">Matching your profile with our comprehensive career database...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Careers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search careers or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedFilters.growth}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, growth: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Growth Levels</option>
              <option value="Explosive">Explosive Growth</option>
              <option value="High">High Growth</option>
              <option value="Moderate">Moderate Growth</option>
              <option value="Stable">Stable Growth</option>
            </select>

            <select
              value={selectedFilters.workEnv}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, workEnv: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Work Environments</option>
              <option value="Remote">Remote</option>
              <option value="Office">Office</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Field">Field Work</option>
            </select>

            <select
              value={selectedFilters.salaryRange}
              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, salaryRange: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Salary Ranges</option>
              <option value="high">High (₹15L+)</option>
              <option value="medium">Medium (₹8-15L)</option>
              <option value="entry">Entry (Under ₹8L)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Career Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Your Top Career Matches ({filteredMatches.length} found)
          </CardTitle>
          <p className="text-gray-600">Select up to 3 careers for detailed simulation</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredMatches.map((match) => (
              <div
                key={match.career}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedCareers.includes(match.career)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleCareerSelect(match.career)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{match.career}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Rank #{match.data.rank}
                      </Badge>
                    </div>

                    {match.match_reasons.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-green-700 font-medium">Why this matches: {match.match_reasons[0]}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{match.match_percentage}%</span>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${match.match_percentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="text-gray-600">Salary:</span>
                      <div className="font-medium">{formatSalary(match.data.salary)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-4 w-4 ${getGrowthColor(match.data.growth)}`} />
                    <div>
                      <span className="text-gray-600">Growth:</span>
                      <div className={`font-medium ${getGrowthColor(match.data.growth)}`}>{match.data.growth}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-gray-600">Environment:</span>
                      <div className="font-medium">{match.data.work_env}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className={`h-4 w-4 ${getDemandColor(match.data.demand_score)}`} />
                    <div>
                      <span className="text-gray-600">Demand:</span>
                      <div className={`font-medium ${getDemandColor(match.data.demand_score)}`}>
                        {match.data.demand_score}/10
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-gray-600 text-sm">Key Traits:</span>
                  {match.data.traits.slice(0, 4).map((trait) => (
                    <Badge key={trait} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  <span className="text-gray-600 text-sm">Locations:</span>
                  {match.data.locations.slice(0, 3).map((location) => (
                    <Badge key={location} variant="outline" className="text-xs">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>

        <Button onClick={handleNext} disabled={selectedCareers.length === 0}>
          Generate Simulations ({selectedCareers.length}/3)
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
