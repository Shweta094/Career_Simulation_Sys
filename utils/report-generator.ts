import jsPDF from "jspdf"
import type autoTable from "jspdf-autotable"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable
    lastAutoTable: {
      finalY: number
    }
  }
}

export interface ReportData {
  userProfile: {
    name: string
    traits: string[]
    skills: string[]
    interests: string[]
  }
  careerSimulations: any[]
  comparativeAnalysis: {
    bestOverallMatch: string
    highestGrowth: string
    bestWorkLife: string
    radarData: any[]
  }
  generatedAt: string
  chartImages?: {
    radarChart?: string
    salaryChart?: string
    burnoutChart?: string
    careerProgressionCharts?: string[]
  }
}

export class CareerReportGenerator {
  static generateComprehensiveReport(data: ReportData): string {
    const report = `
Career Simulation Report
Generated for: ${data.userProfile.name}
Date: ${new Date(data.generatedAt).toLocaleDateString()}

Executive Summary
This comprehensive career analysis report provides detailed insights into your top career matches based on your personality traits, skills, and preferences.

Your Profile
- Selected Traits: ${data.userProfile.traits.join(", ")}
- Key Skills: ${data.userProfile.skills.join(", ")}
- Interests: ${data.userProfile.interests.join(", ")}

Career Simulations Overview

${data.careerSimulations
  .map(
    (sim, index) => `
${index + 1}. ${sim.career}
- Average Salary: ₹${((sim.summary?.avgSalary || 0) / 100000).toFixed(1)}L
- Peak Salary: ₹${((sim.summary?.peakSalary || 0) / 100000).toFixed(1)}L
- Average Satisfaction: ${sim.summary?.avgSatisfaction || 0}/5
- Career Progression: ${sim.summary?.careerProgression || "N/A"}
- Generation Method: ${sim.generationMethod || "Unknown"}

Complete 10-Year Journey with Course Recommendations:
${(sim.yearlyData || sim.yearlyProjections || [])
  .map(
    (year: any) => `
- Year ${year.year}: ${year.title} - ₹${((year.salary || 0) / 100000).toFixed(1)}L (Satisfaction: ${year.satisfaction || 0}/5)
  - Milestone: ${year.keyMilestone || year.milestone || "Professional growth"}
  - Top Courses: ${
    (year.recommendedCourses || [])
      .slice(0, 2)
      .map((c: any) => c.title || "Course")
      .join(", ") || "N/A"
  }
`,
  )
  .join("")}
`,
  )
  .join("")}

Comparative Analysis

Key Metrics Comparison
${data.careerSimulations
  .map((sim) => {
    const firstYear = (sim.yearlyData || sim.yearlyProjections || [])[0]
    const growthRate = firstYear
      ? (((sim.summary?.peakSalary - firstYear.salary) / firstYear.salary) * 100).toFixed(1)
      : "N/A"
    return `${sim.career} | ₹${((sim.summary?.avgSalary || 0) / 100000).toFixed(1)}L | ₹${((sim.summary?.peakSalary || 0) / 100000).toFixed(1)}L | ${sim.summary?.avgSatisfaction || 0}/5 | ${growthRate}% | ${sim.generationMethod || "Unknown"}`
  })
  .join("\n")}

AI Recommendations
- Best Overall Match: ${data.comparativeAnalysis.bestOverallMatch}
- Highest Growth Potential: ${data.comparativeAnalysis.highestGrowth}
- Best Work-Life Balance: ${data.comparativeAnalysis.bestWorkLife}

Recommendations & Next Steps

Based on your comprehensive career analysis, here are our recommendations:

1. Immediate Actions (Next 3 months):
   - Focus on developing skills in your chosen career path
   - Network with professionals in your target industry
   - Consider relevant certifications or training programs

2. Short-term Goals (6-12 months):
   - Apply for entry-level positions in your preferred career
   - Build a portfolio showcasing your relevant skills
   - Seek mentorship from industry professionals

3. Long-term Strategy (2-5 years):
   - Plan for career advancement opportunities
   - Consider specialization in high-demand areas
   - Build leadership and management skills

---
This report was generated using AI-powered career simulation technology.
`
    return report
  }

  static async captureChartImages(): Promise<{
    radarChart?: string
    salaryChart?: string
    burnoutChart?: string
    careerProgressionCharts?: string[]
  }> {
    const chartImages: {
      radarChart?: string
      salaryChart?: string
      burnoutChart?: string
      careerProgressionCharts?: string[]
    } = {}

    try {
      // Dynamic import for html2canvas to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default

      // Small delay to ensure charts are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Capture radar chart
      const radarElement = document.querySelector('[data-chart="radar"]') as HTMLElement
      if (radarElement) {
        try {
          const canvas = await html2canvas(radarElement, {
            backgroundColor: "#ffffff",
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: false,
          })
          chartImages.radarChart = canvas.toDataURL("image/jpeg", 0.8)
        } catch (error) {
          console.warn("Failed to capture radar chart:", error)
        }
      }

      // Capture salary comparison chart
      const salaryElement = document.querySelector('[data-chart="salary"]') as HTMLElement
      if (salaryElement) {
        try {
          const canvas = await html2canvas(salaryElement, {
            backgroundColor: "#ffffff",
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: false,
          })
          chartImages.salaryChart = canvas.toDataURL("image/jpeg", 0.8)
        } catch (error) {
          console.warn("Failed to capture salary chart:", error)
        }
      }

      // Capture burnout vs work-life chart
      const burnoutElement = document.querySelector('[data-chart="burnout"]') as HTMLElement
      if (burnoutElement) {
        try {
          const canvas = await html2canvas(burnoutElement, {
            backgroundColor: "#ffffff",
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: false,
          })
          chartImages.burnoutChart = canvas.toDataURL("image/jpeg", 0.8)
        } catch (error) {
          console.warn("Failed to capture burnout chart:", error)
        }
      }

      // Capture individual career progression charts
      const progressionElements = document.querySelectorAll('[data-chart="progression"]')
      if (progressionElements.length > 0) {
        chartImages.careerProgressionCharts = []
        for (let i = 0; i < progressionElements.length; i++) {
          try {
            const canvas = await html2canvas(progressionElements[i] as HTMLElement, {
              backgroundColor: "#ffffff",
              scale: 1,
              useCORS: true,
              allowTaint: true,
              logging: false,
            })
            chartImages.careerProgressionCharts.push(canvas.toDataURL("image/jpeg", 0.8))
          } catch (error) {
            console.warn(`Failed to capture progression chart ${i}:`, error)
          }
        }
      }
    } catch (error) {
      console.warn("Error capturing chart images:", error)
    }

    return chartImages
  }

  static generatePDFReport(data: ReportData): Promise<Blob> {
    return new Promise((resolve) => {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 20
        let yPosition = margin

        // Helper function to clean text
        const cleanText = (text: string): string => {
          if (!text) return ""
          return text.replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "").trim()
        }

        // Helper function to add text with word wrapping
        const addText = (text: string, fontSize = 10, isBold = false): void => {
          try {
            doc.setFontSize(fontSize)
            doc.setFont("helvetica", isBold ? "bold" : "normal")
            doc.setTextColor("#000000")

            const cleanedText = cleanText(text)
            if (!cleanedText) return

            const lines = doc.splitTextToSize(cleanedText, pageWidth - 2 * margin)

            // Check if we need a new page
            if (yPosition + lines.length * fontSize * 0.5 > pageHeight - margin) {
              doc.addPage()
              yPosition = margin
            }

            doc.text(lines, margin, yPosition)
            yPosition += lines.length * fontSize * 0.5 + 5
          } catch (error) {
            console.warn("Error adding text:", error)
            yPosition += 10
          }
        }

        // Helper function to add images safely
        const addImage = (imageData: string, title: string, maxWidth = 160, maxHeight = 100): void => {
          try {
            if (!imageData || !imageData.startsWith("data:image/")) {
              addText(`[Chart: ${title} - Image not available]`, 10, true)
              return
            }

            // Check if we need a new page
            if (yPosition + maxHeight + 20 > pageHeight - margin) {
              doc.addPage()
              yPosition = margin
            }

            addText(title, 12, true)

            const imgX = (pageWidth - maxWidth) / 2
            doc.addImage(imageData, "JPEG", imgX, yPosition, maxWidth, maxHeight)
            yPosition += maxHeight + 15
          } catch (error) {
            console.warn("Error adding image to PDF:", error)
            addText(`[Chart: ${title} - Image could not be embedded]`, 10, true)
          }
        }

        // Helper function to check for new page
        const checkNewPage = (requiredSpace = 50): void => {
          if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage()
            yPosition = margin
          }
        }

        // Title Page
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.setTextColor("#000000")
        doc.text("Career Simulation Report", pageWidth / 2, 40, { align: "center" })

        doc.setFontSize(16)
        doc.setFont("helvetica", "normal")
        const userName = cleanText(data.userProfile.name || "Career Seeker")
        doc.text(`Generated for: ${userName}`, pageWidth / 2, 60, { align: "center" })
        doc.text(`Date: ${new Date(data.generatedAt).toLocaleDateString()}`, pageWidth / 2, 75, { align: "center" })

        yPosition = 100

        // Executive Summary
        addText("Executive Summary", 18, true)
        addText(
          "This comprehensive career analysis report provides detailed insights into your top career matches based on your personality traits, skills, and preferences.",
        )

        // User Profile
        addText("Your Profile", 16, true)
        addText(`Selected Traits: ${data.userProfile.traits.join(", ")}`)
        addText(`Key Skills: ${data.userProfile.skills.join(", ")}`)
        addText(`Interests: ${data.userProfile.interests.join(", ")}`)

        // Add Visual Charts if available
        if (data.chartImages) {
          checkNewPage(120)
          addText("Visual Analysis", 18, true)

          if (data.chartImages.radarChart) {
            addImage(data.chartImages.radarChart, "Multi-Metric Career Comparison", 160, 120)
          }

          if (data.chartImages.salaryChart) {
            addImage(data.chartImages.salaryChart, "Salary Growth Comparison", 160, 100)
          }

          if (data.chartImages.burnoutChart) {
            addImage(data.chartImages.burnoutChart, "Burnout Risk vs Work-Life Balance", 160, 100)
          }
        }

        // Career Simulations Overview
        addText("Career Simulations Overview", 16, true)

        data.careerSimulations.forEach((sim, index) => {
          checkNewPage(100)
          addText(`${index + 1}. ${sim.career || "Unknown Career"}`, 14, true)
          addText(`Generation Method: ${sim.generationMethod || "Unknown"}`)
          addText(`Average Salary: ₹${((sim.summary?.avgSalary || 0) / 100000).toFixed(1)}L`)
          addText(`Peak Salary: ₹${((sim.summary?.peakSalary || 0) / 100000).toFixed(1)}L`)
          addText(`Average Satisfaction: ${sim.summary?.avgSatisfaction || 0}/5`)
          addText(`Career Progression: ${sim.summary?.careerProgression || "N/A"}`)

          // Add individual career progression chart if available
          if (data.chartImages?.careerProgressionCharts?.[index]) {
            addImage(data.chartImages.careerProgressionCharts[index], `${sim.career} - 10-Year Progression`, 160, 100)
          }

          yPosition += 10
        })

        // Comparative Analysis Table
        checkNewPage(100)
        addText("Comparative Analysis", 16, true)

        try {
          // Create comparison table
          const tableData = data.careerSimulations.map((sim) => [
            cleanText(sim.career || "Unknown"),
            `₹${((sim.summary?.avgSalary || 0) / 100000).toFixed(1)}L`,
            `₹${((sim.summary?.peakSalary || 0) / 100000).toFixed(1)}L`,
            `${sim.summary?.avgSatisfaction || 0}/5`,
            sim.summary?.totalGrowth || "N/A",
            cleanText(sim.generationMethod || "Unknown"),
          ])

          doc.autoTable({
            head: [["Career", "Avg Salary", "Peak Salary", "Satisfaction", "Growth", "Method"]],
            body: tableData,
            startY: yPosition,
            theme: "grid",
            headStyles: { fillColor: [66, 139, 202] },
            margin: { left: margin, right: margin },
            styles: { fontSize: 8 },
          })

          yPosition = doc.lastAutoTable.finalY + 20
        } catch (error) {
          console.warn("Error creating table:", error)
          addText("Comparative analysis table could not be generated", 10, true)
        }

        // AI Recommendations
        checkNewPage(60)
        addText("AI Recommendations", 16, true)
        addText(`Best Overall Match: ${data.comparativeAnalysis.bestOverallMatch}`)
        addText(`Highest Growth Potential: ${data.comparativeAnalysis.highestGrowth}`)
        addText(`Best Work-Life Balance: ${data.comparativeAnalysis.bestWorkLife}`)

        // Detailed Career Analysis with COMPLETE 10-Year Journey
        data.careerSimulations.forEach((sim, index) => {
          checkNewPage(150)
          addText(`${sim.career || "Unknown Career"} - Complete 10-Year Learning Journey`, 16, true)
          addText(`Generation Method: ${sim.generationMethod || "Unknown"}`, 10, true)

          addText("Strengths:", 12, true)
          if (sim.pros && Array.isArray(sim.pros)) {
            sim.pros.slice(0, 5).forEach((pro: string) => {
              addText(`• ${cleanText(pro)}`)
            })
          } else {
            addText("• High growth potential")
            addText("• Strong career progression")
            addText("• Good salary prospects")
          }

          addText("Challenges:", 12, true)
          if (sim.cons && Array.isArray(sim.cons)) {
            sim.cons.slice(0, 5).forEach((con: string) => {
              addText(`• ${cleanText(con)}`)
            })
          } else {
            addText("• Requires continuous learning")
            addText("• Competitive market")
            addText("• Skill development needed")
          }

          // COMPLETE 10-Year Learning Journey (NOT LIMITED TO 5 YEARS)
          addText("Complete 10-Year Learning Pathway:", 12, true)
          const yearlyData = sim.yearlyData || sim.yearlyProjections || []

          if (yearlyData.length > 0) {
            // Show ALL years, not just first 5
            yearlyData.forEach((year: any, yearIndex: number) => {
              checkNewPage(100) // More space for each year

              // Year header with enhanced styling
              addText(`Year ${year.year}: ${cleanText(year.title || "Professional Role")}`, 12, true)

              // Key metrics for the year
              addText(
                `Salary: ₹${((year.salary || 0) / 100000).toFixed(1)}L | Satisfaction: ${year.satisfaction || 0}/5 | Work-Life: ${year.workLifeBalance || 0}/5`,
              )
              addText(`Key Milestone: ${cleanText(year.keyMilestone || year.milestone || "Professional growth")}`)

              // Skills required for this year
              if (year.skillsRequired && Array.isArray(year.skillsRequired) && year.skillsRequired.length > 0) {
                addText("Skills Required:", 10, true)
                year.skillsRequired.forEach((skill: string) => {
                  addText(`  • ${cleanText(skill)}`)
                })
              }

              // Challenges for this year
              if (year.challenges && Array.isArray(year.challenges) && year.challenges.length > 0) {
                addText("Key Challenges:", 10, true)
                year.challenges.forEach((challenge: string) => {
                  addText(`  • ${cleanText(challenge)}`)
                })
              }

              // Opportunities for this year
              if (year.opportunities && Array.isArray(year.opportunities) && year.opportunities.length > 0) {
                addText("Growth Opportunities:", 10, true)
                year.opportunities.forEach((opportunity: string) => {
                  addText(`  • ${cleanText(opportunity)}`)
                })
              }

              // Course recommendations for this year
              if (
                year.recommendedCourses &&
                Array.isArray(year.recommendedCourses) &&
                year.recommendedCourses.length > 0
              ) {
                addText("Recommended Courses:", 10, true)
                year.recommendedCourses.forEach((course: any) => {
                  addText(
                    `• ${cleanText(course.title || "Professional Course")} (${cleanText(course.provider || "Provider")})`,
                  )
                  addText(
                    `  Duration: ${course.duration || "N/A"} | Cost: ${course.estimatedCost || "N/A"} | Priority: ${course.priority || "Medium"}`,
                  )
                  if (course.description) {
                    addText(`  Description: ${cleanText(course.description)}`, 9)
                  }
                  addText(`  Type: ${course.type || "General"} | Difficulty: ${course.difficulty || "Intermediate"}`, 9)
                })
              }

              // Add some spacing between years
              yPosition += 8
            })
          } else {
            addText("Detailed yearly progression data not available", 10)
          }

          // Add career summary after all years
          checkNewPage(60)
          addText(`${sim.career} - Career Summary`, 14, true)
          addText(`Total Career Growth: ${sim.summary?.totalGrowth || "N/A"}`)
          addText(`Final Position: ${sim.summary?.careerProgression || "Senior Professional"}`)
          addText(`Average Work-Life Balance: ${sim.summary?.avgWorkLifeBalance || "N/A"}/5`)
          addText(`Average Burnout Risk: ${sim.summary?.avgBurnoutRisk || "N/A"}/5`)
        })

        // Course Summary Table for All Years
        checkNewPage(100)
        addText("Complete Course Recommendations Summary", 16, true)

        try {
          const allCourses: any[] = []
          data.careerSimulations.forEach((sim) => {
            const yearlyData = sim.yearlyData || sim.yearlyProjections || []
            yearlyData.forEach((year: any) => {
              if (year.recommendedCourses && Array.isArray(year.recommendedCourses)) {
                year.recommendedCourses.forEach((course: any) => {
                  allCourses.push([
                    cleanText(sim.career || "Unknown"),
                    `Year ${year.year}`,
                    cleanText(course.title || "Course"),
                    cleanText(course.provider || "Provider"),
                    course.priority || "Medium",
                    course.estimatedCost || "N/A",
                  ])
                })
              }
            })
          })

          if (allCourses.length > 0) {
            // Split courses into chunks to fit on pages
            const coursesPerPage = 15
            for (let i = 0; i < allCourses.length; i += coursesPerPage) {
              const courseChunk = allCourses.slice(i, i + coursesPerPage)

              if (i > 0) {
                checkNewPage(150)
                addText(`Course Recommendations (continued) - Page ${Math.floor(i / coursesPerPage) + 1}`, 12, true)
              }

              doc.autoTable({
                head: [["Career", "Year", "Course", "Provider", "Priority", "Cost"]],
                body: courseChunk,
                startY: yPosition,
                theme: "striped",
                headStyles: { fillColor: [52, 152, 219] },
                margin: { left: margin, right: margin },
                styles: { fontSize: 7 },
              })

              yPosition = doc.lastAutoTable.finalY + 20
            }

            addText(`Total Courses Recommended: ${allCourses.length}`, 10, true)
          }
        } catch (error) {
          console.warn("Error creating course summary table:", error)
          addText("Course summary table could not be generated", 10, true)
        }

        // Conclusion
        checkNewPage(80)
        addText("Conclusion", 16, true)
        addText(
          "Your career simulation analysis shows strong potential across all selected paths. The comparative analysis reveals that each career offers unique advantages aligned with different aspects of your profile.",
        )

        addText("Key Takeaways:", 12, true)
        addText("• All selected careers show positive growth trajectories over the full 10-year period")
        addText("• Your trait profile aligns well with the demands of these careers")
        addText("• Follow the recommended learning pathways for optimal development")
        addText("• Each year has specific courses designed to advance your skills")
        addText("• Consider your personal priorities when making your final decision")

        // Footer
        doc.setFontSize(8)
        doc.setFont("helvetica", "italic")
        doc.setTextColor("#666666")
        doc.text(
          "This report was generated using AI-powered career simulation technology.",
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" },
        )

        // Convert to blob
        const pdfBlob = doc.output("blob")
        resolve(pdfBlob)
      } catch (error) {
        console.error("Error generating PDF:", error)
        // Fallback to text report as blob
        const textContent = this.generateComprehensiveReport(data)
        const textBlob = new Blob([textContent], { type: "text/plain" })
        resolve(textBlob)
      }
    })
  }

  static async downloadReport(data: ReportData, filename?: string): Promise<void> {
    try {
      console.log("📊 Capturing chart images...")

      // Capture chart images before generating PDF
      const chartImages = await this.captureChartImages()
      data.chartImages = chartImages

      console.log("📄 Generating PDF report...")
      const pdfBlob = await this.generatePDFReport(data)

      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url

      // Clean filename
      const cleanName = (data.userProfile.name || "Career-Seeker").replace(/[^a-zA-Z0-9-_]/g, "-")
      const dateStr = new Date().toISOString().split("T")[0]

      link.download = filename || `career-report-${cleanName}-${dateStr}.pdf`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)

      console.log("✅ PDF report downloaded successfully")
    } catch (error) {
      console.error("Error downloading PDF report:", error)

      // Fallback to text download
      try {
        const reportContent = this.generateComprehensiveReport(data)
        const blob = new Blob([reportContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url

        const cleanName = (data.userProfile.name || "Career-Seeker").replace(/[^a-zA-Z0-9-_]/g, "-")
        const dateStr = new Date().toISOString().split("T")[0]

        link.download = `career-report-${cleanName}-${dateStr}.txt`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        console.log("✅ Text report downloaded as fallback")
      } catch (fallbackError) {
        console.error("Failed to download fallback text report:", fallbackError)
        alert("Failed to generate report. Please try again.")
      }
    }
  }
}

export default CareerReportGenerator
