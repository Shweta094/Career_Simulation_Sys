import numpy as np
from scipy import stats

class StatisticalCareerModel:
    def __init__(self):
        # Based on real industry data
        self.salary_distributions = {
            "Software Engineer": {
                "entry": stats.norm(600000, 100000),
                "mid": stats.norm(1200000, 200000),
                "senior": stats.norm(2000000, 400000)
            },
            "Data Scientist": {
                "entry": stats.norm(700000, 120000),
                "mid": stats.norm(1400000, 250000),
                "senior": stats.norm(2200000, 450000)
            }
        }
        
        self.satisfaction_correlations = {
            "work_life_balance": 0.4,
            "salary": 0.3,
            "growth_opportunities": 0.5,
            "job_security": 0.2
        }
    
    def predict_career_trajectory(self, career: str, user_values: dict) -> dict:
        if career not in self.salary_distributions:
            return self.generate_generic_prediction(career)
            
        distributions = self.salary_distributions[career]
        trajectory = []
        
        for year in range(1, 11):
            # Determine career level
            if year <= 3:
                level = "entry"
            elif year <= 7:
                level = "mid"
            else:
                level = "senior"
            
            # Sample salary from distribution
            salary = max(300000, int(distributions[level].rvs()))
            
            # Calculate satisfaction based on user values
            satisfaction = 3.0
            for value, weight in user_values.items():
                if value in self.satisfaction_correlations:
                    satisfaction += (weight / 100) * self.satisfaction_correlations[value]
            
            satisfaction = max(1.0, min(5.0, satisfaction + np.random.normal(0, 0.3)))
            
            trajectory.append({
                "year": year,
                "salary": salary,
                "satisfaction": round(satisfaction, 1),
                "confidence": 0.85 if year <= 5 else 0.65  # Confidence decreases over time
            })
        
        return {"trajectory": trajectory, "model": "statistical"}
