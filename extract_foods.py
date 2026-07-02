import json
import re

DAILY_VALUES = {
    "sedentary": {"calories": 2000, "protein": 50, "carbs": 300, "fat": 65},
    "normal": {"calories": 2200, "protein": 50, "carbs": 330, "fat": 70},  
    "active": {"calories": 2500, "protein": 56, "carbs": 350, "fat": 80}
}

def is_simple_food(desc):
    desc_lower = desc.lower()
    if 'raw' in desc_lower and 'frozen' not in desc_lower:
        return True
    if 'milk' in desc_lower and 'fluid' in desc_lower:
        return True
    return False

def extract_food_data(food, matched_kw):
    desc = food.get('description', '') or ''
    nutrients = food.get('foodNutrients') or []
    nutrient_map = {}
    for n in nutrients:
        if n.get('nutrient'):
            nutrient_map[n['nutrient']['number']] = n.get('amount', 0)
    
    calories = nutrient_map.get('208', nutrient_map.get('957', 0))
    if not calories:
        return None
    
    return {
        'name': desc,
        'calories_100g': calories,
        'protein_g': nutrient_map.get('203', 0),
        'fat_g': nutrient_map.get('204', 0),
        'carbs_g': nutrient_map.get('205', 0)
    }

def main():
    with open('FoodData_Central_foundation_food_json_2026-04-30.json', 'r') as f:
        data = json.load(f)
    
    target_keywords = ['apple', 'apples', 'banana', 'broccoli', 'lettuce', 'orange', 'pear',
                       'chicken', 'beef', 'milk', 'salmon', 'avocado', 'tomato', 'peach']
    
    foods = []
    found_keywords = set()
    
    for food in data['FoundationFoods']:
        if food is None:
            continue
        desc = food.get('description', '') or ''
        desc_lower = desc.lower()
        
        matched_kw = None
        for kw in target_keywords:
            if kw in desc_lower and kw not in found_keywords:
                matched_kw = kw
                break
        
        if matched_kw and is_simple_food(desc):
            food_data = extract_food_data(food, matched_kw)
            if food_data:
                foods.append(food_data)
                found_keywords.add(matched_kw)
    
    for food in foods[:10]:
        for level in ['sedentary', 'normal', 'active']:
            dv = DAILY_VALUES[level]
            food[f'calories_pct_{level}'] = round(food['calories_100g'] / dv['calories'] * 100, 1) if dv['calories'] else 0
            food[f'protein_pct_{level}'] = round(food['protein_g'] / dv['protein'] * 100, 1) if dv['protein'] else 0
            food[f'fat_pct_{level}'] = round(food['fat_g'] / dv['fat'] * 100, 1) if dv['fat'] else 0
            food[f'carbs_pct_{level}'] = round(food['carbs_g'] / dv['carbs'] * 100, 1) if dv['carbs'] else 0
    
    output = {'foods': foods[:10]}
    with open('foods.json', 'w') as f:
        json.dump(output, f, indent=2)
    print(f"Extracted {len(output['foods'])} foods to foods.json")
    for food in output['foods']:
        print(f"  - {food['name']}")

if __name__ == '__main__':
    main()