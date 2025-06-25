"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react"

interface DecisionTreeProps {
  userData: any
  onNext: (data: any) => void
  onBack: () => void
}

export default function DecisionTree({ userData, onNext, onBack }: DecisionTreeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const questions = [
    {
      id: "domain",
      question: "Which domain interests you most?",
      options: [
        { value: "technology", label: "Technology & Software" },
        { value: "healthcare", label: "Healthcare & Medicine" },
        { value: "business", label: "Business & Finance" },
        { value: "creative", label: "Creative & Arts" },
        { value: "education", label: "Education & Research" },
        { value: "social", label: "Social Impact & Non-profit" },
      ],
    },
    {
      id: "environment",
      question: "What work environment do you prefer?",
      options: [
        { value: "office", label: "Traditional Office Setting" },
        { value: "remote", label: "Remote/Work from Home" },
        { value: "hybrid", label: "Hybrid (Office + Remote)" },
        { value: "field", label: "Field Work/Travel" },
        { value: "lab", label: "Laboratory/Research Facility" },
        { value: "client", label: "Client Sites/Consulting" },
      ],
    },
    {
      id: "growth",
      question: "How important is rapid career advancement?",
      options: [
        { value: "very-high", label: "Very Important - I want to climb quickly" },
        { value: "high", label: "Important - Steady progression matters" },
        { value: "moderate", label: "Moderate - Some growth is fine" },
        { value: "low", label: "Not Important - I prefer stability" },
      ],
    },
    {
      id: "worklife",
      question: "How do you view work-life balance?",
      options: [
        { value: "strict", label: "Strict boundaries - Work stays at work" },
        { value: "flexible", label: "Flexible - Some overlap is okay" },
        { value: "integrated", label: "Integrated - Work and life blend" },
        { value: "workfirst", label: "Work-focused - Career comes first" },
      ],
    },
    {
      id: "risk",
      question: "What's your risk tolerance for career choices?",
      options: [
        { value: "high", label: "High - I'm comfortable with uncertainty" },
        { value: "moderate", label: "Moderate - Some risk is acceptable" },
        { value: "low", label: "Low - I prefer stable, predictable paths" },
        { value: "very-low", label: "Very Low - Security is paramount" },
      ],
    },
  ]

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      onNext({ decisionAnswers: answers })
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else {
      onBack()
    }
  }

  const currentAnswer = answers[questions[currentQuestion].id]
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h3>

          <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswerChange}>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentQuestion === 0 ? "Back to Profile" : "Previous"}
          </Button>

          <Button onClick={handleNext} disabled={!currentAnswer}>
            {isLastQuestion ? "Find My Careers" : "Next Question"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
