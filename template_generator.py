class TemplateBasedGenerator:
    def __init__(self):
        self.narrative_templates = {
            "high_growth": [
                "Rapidly advanced through {company_type} environment",
                "Took on increasing responsibilities in {domain}",
                "Demonstrated exceptional {key_skill} capabilities"
            ],
            "steady_growth": [
                "Built solid foundation in {domain}",
                "Consistently delivered quality {work_type}",
                "Developed expertise in {specialization}"
            ],
            "leadership_track": [
                "Transitioned into management role",
                "Built and mentored high-performing team",
                "Drove strategic initiatives across organization"
            ]
        }
    
    def generate_narrative(self, career_path: str, user_profile: dict) -> str:
        # Select template based on user traits and preferences
        if user_profile.get("leadership_affinity", 0) > 0.7:
            template_type = "leadership_track"
        elif user_profile.get("growth_preference") == "rapid":
            template_type = "high_growth"
        else:
            template_type = "steady_growth"
            
        templates = self.narrative_templates[template_type]
        
        # Fill in variables based on career and user data
        narrative = []
        for template in templates:
            filled_template = template.format(
                company_type="tech startup" if "Software" in career_path else "established company",
                domain=career_path.lower(),
                key_skill=user_profile.get("top_skill", "technical"),
                work_type="solutions" if "Engineer" in career_path else "analysis",
                specialization=user_profile.get("specialization", "core competencies")
            )
            narrative.append(filled_template)
            
        return ". ".join(narrative)
