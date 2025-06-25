"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ArrowRight, User, Lightbulb, DollarSign, Brain } from "lucide-react"

interface FormData {
  name: string
  age: string
  selectedTraits: string[]
  skills: string[]
  interests: string[]
  values: {
    salary: number[]
    workLifeBalance: number[]
    jobSecurity: number[]
    creativity: number[]
    leadership: number[]
  }
}

interface UserInputFormProps {
  onNext: (data: any) => void
}

export default function UserInputForm({ onNext }: UserInputFormProps) {
  const availableTraits = [
    // Personality Traits
    "Logical",
    "Analytical",
    "Creative",
    "Empathetic",
    "Patient",
    "Curious",
    "Detail-oriented",
    "Strategic",
    "Independent",
    "Collaborative",
    "Organized",
    "Decisive",
    "Communicative",
    "Innovative",
    "Technical",

    // Work Style Traits
    "Problem-solving",
    "Research-oriented",
    "User-focused",
    "Data-driven",
    "Process-oriented",
    "Quality-focused",
    "Safety-conscious",
    "Risk-tolerant",
    "Adaptable",
    "Resilient",
    "Energetic",
    "Persistent",

    // Professional Traits
    "Business-savvy",
    "Entrepreneurial",
    "Regulatory-aware",
    "Ethical",
    "Eco-conscious",
    "Health-focused",
    "Traditional",
    "Visionary",
    "Mathematical",
    "Artistic",
    "Musical",
    "Athletic",
    "Mechanical",

    // Interpersonal Traits
    "Sociable",
    "Persuasive",
    "Mentoring",
    "Team-oriented",
    "Client-focused",
    "Cultural-aware",
    "Linguistic",
    "Diplomatic",
    "Negotiation-skilled",
  ]

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    selectedTraits: [], // Replace personality with selectedTraits
    skills: [],
    interests: [],
    values: {
      salary: [50],
      workLifeBalance: [50],
      jobSecurity: [50],
      creativity: [50],
      leadership: [50],
    },
  })

  const skillOptions = [
    "Programming",
    "Data Analysis",
    "Communication",
    "Leadership",
    "Design",
    "Marketing",
    "Sales",
    "Research",
    "Problem Solving",
    "Project Management",
    "Writing",
    "Public Speaking",
    "Financial Analysis",
    "Teaching",
    "Counseling",
  ]

  const interestOptions = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Arts & Design",
    "Sports",
    "Environment",
    "Social Impact",
    "Business",
    "Science",
    "Travel",
    "Food",
    "Fashion",
    "Gaming",
    "Music",
  ]

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      skills: checked ? [...prev.skills, skill] : prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interest] : prev.interests.filter((i) => i !== interest),
    }))
  }

  const handleValueChange = (value: string, newValue: number[]) => {
    setFormData((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [value]: newValue,
      },
    }))
  }

  const handleTraitChange = (trait: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedTraits: checked ? [...prev.selectedTraits, trait] : prev.selectedTraits.filter((t) => t !== trait),
    }))
  }

  const handleSubmit = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                placeholder="Enter your age"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Traits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personal & Professional Traits
          </CardTitle>
          <CardDescription>Select traits that best describe you (choose 5-10 traits)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableTraits.map((trait) => (
              <div key={trait} className="flex items-center space-x-2">
                <Checkbox
                  id={trait}
                  checked={formData.selectedTraits.includes(trait)}
                  onCheckedChange={(checked) => handleTraitChange(trait, checked as boolean)}
                />
                <Label htmlFor={trait} className="text-sm cursor-pointer">
                  {trait}
                </Label>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-600">Selected: {formData.selectedTraits.length} traits</div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Skills & Competencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skillOptions.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={formData.skills.includes(skill)}
                  onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                />
                <Label htmlFor={skill} className="text-sm cursor-pointer">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Interests & Passions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                />
                <Label htmlFor={interest} className="text-sm cursor-pointer">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="flex items-center gap-2"
          disabled={!formData.name || formData.selectedTraits.length < 3 || formData.skills.length === 0}
        >
          Continue to Decision Tree
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}