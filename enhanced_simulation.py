import random
from typing import Dict, List, Any

class EnhancedCareerSimulator:
    def __init__(self):
        self.career_templates = {
            "Software Engineer": {
                "titles": [
                    "Junior Developer", "Software Engineer", "Senior Engineer", 
                    "Lead Engineer", "Principal Engineer", "Engineering Manager",
                    "Senior Manager", "Director of Engineering", "VP Engineering", "CTO"
                ],
                "base_salary": 600000,
                "growth_rate": (0.12, 0.25),  # 12-25% annual growth
                "satisfaction_factors": {
                    "creative": 0.8, "analytical": 0.9, "leadership": 0.6
                },
                "milestones": [
                    "Completed first major feature", "Led code review process",
                    "Mentored junior developer", "Architected system component",
                    "Led cross-team project", "Established engineering standards",
                    "Built and scaled team", "Defined technical strategy",
                    "Drove company-wide initiatives", "Shaped engineering culture"
                ]
            },
            "Data Scientist": {
                "titles": [
                    "Data Analyst", "Junior Data Scientist", "Data Scientist",
                    "Senior Data Scientist", "Lead Data Scientist", "Principal Data Scientist",
                    "Data Science Manager", "Director of Data Science", "VP Analytics", "Chief Data Officer"
                ],
                "base_salary": 700000,
                "growth_rate": (0.15, 0.30),
                "satisfaction_factors": {
                    "analytical": 0.95, "curious": 0.9, "detail-oriented": 0.8
                },
                "milestones": [
                    "Built first ML model", "Deployed model to production",
                    "Presented insights to executives", "Led A/B testing initiative",
                    "Established data pipeline", "Created data strategy",
                    "Built analytics team", "Implemented ML platform",
                    "Drove data-driven culture", "Shaped company data strategy"
                ]
            }
        }
        
        self.personality_modifiers = {
            "INTJ": {"satisfaction_boost": 0.1, "leadership_affinity": 0.8},
            "ENTJ": {"satisfaction_boost": 0.15, "leadership_affinity": 0.95},
            "INFP": {"satisfaction_boost": 0.05, "leadership_affinity": 0.4},
            "ENFP": {"satisfaction_boost": 0.12, "leadership_affinity": 0.7}
        }

    def generate_enhanced_simulation(self, career: str, user_traits: List[str], 
                                   personality: str, values: Dict[str, int]) -> Dict[str, Any]:
        
        if career not in self.career_templates:
            return self.generate_generic_simulation(career)
            
        template = self.career_templates[career]
        personality_mod = self.personality_modifiers.get(personality, {})
        
        simulation = {
            "career": career,
            "yearly_data": [],
            "summary": {}
        }
        
        current_salary = template["base_salary"]
        base_satisfaction = 3.0
        
        # Adjust base satisfaction based on trait matching
        trait_match_score = len(set(user_traits) & set(template["satisfaction_factors"].keys())) / len(template["satisfaction_factors"])
        base_satisfaction += trait_match_score * 1.5
        
        # Apply personality modifier
        base_satisfaction += personality_mod.get("satisfaction_boost", 0)
        
        for year in range(1, 11):
            # Calculate salary growth
            growth_min, growth_max = template["growth_rate"]
            growth_rate = random.uniform(growth_min, growth_max)
            
            # Apply value-based modifiers
            if values.get("salary", 50) > 70:  # High salary importance
                growth_rate *= 1.1
            
            current_salary *= (1 + growth_rate)
            
            # Determine title based on year and leadership affinity
            title_index = min(
                int((year - 1) * personality_mod.get("leadership_affinity", 0.7) * 1.2),
                len(template["titles"]) - 1
            )
            title = template["titles"][title_index]
            
            # Calculate satisfaction with some variance
            satisfaction = base_satisfaction + random.uniform(-0.5, 0.5)
            satisfaction = max(1.0, min(5.0, satisfaction))
            
            # Select appropriate milestone
            milestone = template["milestones"][min(year - 1, len(template["milestones"]) - 1)]
            
            yearly_data = {
                "year": f"Year {year}",
                "title": title,
                "salary": int(current_salary),
                "satisfaction": round(satisfaction, 1),
                "milestone": milestone
            }
            
            simulation["yearly_data"].append(yearly_data)
        
        # Calculate summary
        salaries = [y["salary"] for y in simulation["yearly_data"]]
        satisfactions = [y["satisfaction"] for y in simulation["yearly_data"]]
        
        simulation["summary"] = {
            "avg_salary": int(sum(salaries) / len(salaries)),
            "peak_salary": max(salaries),
            "avg_satisfaction": round(sum(satisfactions) / len(satisfactions), 1),
            "final_title": simulation["yearly_data"][-1]["title"]
        }
        
        return simulation

    def generate_generic_simulation(self, career: str) -> Dict[str, Any]:
        # Fallback for careers not in templates
        base_salary = random.randint(400000, 800000)
        yearly_data = []
        
        for year in range(1, 11):
            salary = base_salary * (1.1 ** (year - 1))
            satisfaction = random.uniform(2.5, 4.5)
            
            yearly_data.append({
                "year": f"Year {year}",
                "title": f"{['Junior', 'Associate', 'Senior', 'Lead', 'Principal'][min(year//2, 4)]} {career}",
                "salary": int(salary),
                "satisfaction": round(satisfaction, 1),
                "milestone": f"Professional milestone in year {year}"
            })
        
        return {
            "career": career,
            "yearly_data": yearly_data,
            "summary": {
                "avg_salary": int(sum(y["salary"] for y in yearly_data) / len(yearly_data)),
                "peak_salary": max(y["salary"] for y in yearly_data),
                "avg_satisfaction": round(sum(y["satisfaction"] for y in yearly_data) / len(yearly_data), 1),
                "final_title": yearly_data[-1]["title"]
            }
        }

# Usage example
simulator = EnhancedCareerSimulator()
result = simulator.generate_enhanced_simulation(
    career="Software Engineer",
    user_traits=["analytical", "creative", "problem-solving"],
    personality="INTJ",
    values={"salary": 80, "work_life_balance": 60}
)

print("Enhanced Career Simulation:")
for year_data in result["yearly_data"][:3]:  # Show first 3 years
    print(f"{year_data['year']}: {year_data['title']} - ₹{year_data['salary']:,} - Satisfaction: {year_data['satisfaction']}/5")
