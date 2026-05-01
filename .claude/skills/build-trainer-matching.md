# build-trainer-matching.md

## Description
This skill orchestrates AI agents to implement the trainer matching feature for the Seminar Management Platform.

## Agents Pipeline

### Agent 1: Planner Agent
**Input:** Project structure analysis + existing codebase
**Process:**
1. Scan `app/api/courses/` and `app/api/trainers/` structure
2. Identify existing course and trainer data models
3. Define implementation steps for AI-powered trainer matching
**Output:** JSON plan with 4 phases:
```json
{
  "phase1": "Backend endpoint /api/trainers/suggest",
  "phase2": "AI prompt engineering for ranking trainers",
  "phase3": "Frontend component TrainerSuggestions",
  "phase4": "Integration with course creation/editing form"
}