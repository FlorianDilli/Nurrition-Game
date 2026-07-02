# Nutrition Game - Design Document

A browser-based game to learn nutritional values of foods in a playful way.

## Core Concept

Guess the nutritional content of foods to build intuition about macronutrients while having fun.

## Gameplay

### Two Game Modes

1. **Intuition Mode**: Quick estimation using buttons
   - Buttons for each nutrient: Low / Medium / High
   - Builds quick recognition of whether foods are high or low in macros

2. **Precision Mode**: Exact numerical guessing
   - Sliders for calories, protein, fat, carbs
   - Units displayed in both grams and daily percentage
   - Partial points awarded for close guesses (within tolerance)

### Progression

- **Endless Mode**: Random foods, continuous play
- **Skill Levels**: Difficulty tiers (beginner, intermediate, expert)

### Screen Flow

```
Home → Mode Selection → Daily Value Selection (Sedentary/Normal/Active) → 
Category Selection → Round Screen → Feedback Screen → Next Round
```

## Food Data

- Uses USDA FoodData Central Foundation Foods dataset
- Nutrition per 100g serving
- Core metrics: Calories, Protein (g), Fat (g), Carbohydrates (g)

### Daily Value Reference (for % calculations)

| Level | Calories | Protein | Carbs | Fat |
|-------|----------|---------|-------|-----|
| Sedentary | 2000 kcal | 50g | 300g | 65g |
| Normal | 2200 kcal | 50g | 330g | 70g |
| Active | 2500 kcal | 56g | 350g | 80g |

## Visual Design

- Modern, clean interface
- No images - food names only displayed
- Intuitive controls (buttons for intuition mode, sliders for precision)
- Clear feedback with exact values revealed after guess

## Technical

- Static HTML/CSS/JS for GitHub Pages deployment
- No backend required
- Data bundled as JSON file
- Session-based score tracking (localStorage)

## Scoring

- Points awarded for guesses within tolerance
- Tolerance: ±20% of actual value considered "correct"
- Closer guesses = more points
- Streak bonuses for consecutive correct answers