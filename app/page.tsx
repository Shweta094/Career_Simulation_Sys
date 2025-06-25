"use client"

import React from "react"
import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, TrendingUp, FileText } from "lucide-react"
import UserInputForm from "@/components/user-input-form"
import DecisionTree from "@/components/decision-tree"
import CareerMatching from "@/components/career-matching"
import EnhancedSimulationResults from "@/components/enhanced-simulation-results"

export default function CareerSimulationApp() {
  const [userData, setUserData] = useState({
    selectedTraits: [],
    skills: [],
    interests: [],
    values: {},
    decisionAnswers: {},
    selectedCareers: [],
  })

  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { title: "Personal Profile", icon: Brain, description: "Tell us about yourself" },
    { title: "Decision Tree", icon: Target, description: "Answer key questions" },
    { title: "Career Matching", icon: TrendingUp, description: "Find your matches" },
    { title: "AI Simulation", icon: FileText, description: "Explore your future with AI" },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = (data: any) => {
    setUserData((prev) => ({ ...prev, ...data }))
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Career Simulation</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your ideal career path through personalized simulations powered by Gemini AI
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Progress
                </CardTitle>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  {steps.map((step, index) => (
                    <span key={index} className={index <= currentStep ? "text-blue-600 font-medium" : ""}>
                      {step.title}
                    </span>
                  ))}
                </div>
              </CardHeader>
            </Card>

            <UserInputForm onNext={handleNext} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 text-blue-600" })}
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
              <Progress value={progress} className="w-full" />
            </CardHeader>
          </Card>

          {currentStep === 1 && <DecisionTree userData={userData} onNext={handleNext} onBack={handleBack} />}

          {currentStep === 2 && <CareerMatching userData={userData} onNext={handleNext} onBack={handleBack} />}

          {currentStep === 3 && <EnhancedSimulationResults userData={userData} onBack={handleBack} />}
        </div>
      </div>
    </div>
  )
}
