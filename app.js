const NUTRIENTS = {
    calories: { label: 'Calories', unit: 'kcal', daily: 2300 },
    protein: { label: 'Protein', unit: 'g', daily: 60 },
    carbs: { label: 'Carbohydrates', unit: 'g', daily: 325 },
    fat: { label: 'Fat', unit: 'g', daily: 75 }
};

const CATEGORIES = [
    { id: 'all', label: 'All Foods' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'meat', label: 'Meat' },
    { id: 'fish', label: 'Fish' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'grains', label: 'Grains' },
    { id: 'legumes', label: 'Legumes' }
];

let foods = [];

const DEFAULT_FOODS = [
    {"name":"Broccoli","category":"vegetables","calories":34,"protein":2.8,"carbs":7,"fat":0.4},
    {"name":"Spinach","category":"vegetables","calories":23,"protein":2.9,"carbs":3.6,"fat":0.4},
    {"name":"Carrot","category":"vegetables","calories":41,"protein":0.9,"carbs":10,"fat":0.2},
    {"name":"Tomato","category":"vegetables","calories":18,"protein":0.9,"carbs":3.9,"fat":0.2},
    {"name":"Cucumber","category":"vegetables","calories":15,"protein":0.7,"carbs":3.6,"fat":0.1},
    {"name":"Apple","category":"fruits","calories":52,"protein":0.3,"carbs":14,"fat":0.2},
    {"name":"Banana","category":"fruits","calories":89,"protein":1.1,"carbs":23,"fat":0.3},
    {"name":"Strawberry","category":"fruits","calories":32,"protein":0.7,"carbs":8,"fat":0.3},
    {"name":"Orange","category":"fruits","calories":47,"protein":0.9,"carbs":12,"fat":0.1},
    {"name":"Avocado","category":"fruits","calories":160,"protein":2.0,"carbs":9,"fat":15},
    {"name":"Chicken Breast","category":"meat","calories":165,"protein":31.0,"carbs":0,"fat":3.6},
    {"name":"Beef (Ground)","category":"meat","calories":250,"protein":26.0,"carbs":0,"fat":15.0},
    {"name":"Turkey Breast","category":"meat","calories":135,"protein":30.0,"carbs":0,"fat":0.7},
    {"name":"Pork Chop","category":"meat","calories":231,"protein":25.0,"carbs":0,"fat":14.0},
    {"name":"Salmon","category":"fish","calories":206,"protein":28.0,"carbs":0,"fat":10.0},
    {"name":"Tuna (Canned)","category":"fish","calories":116,"protein":26.0,"carbs":0,"fat":0.8},
    {"name":"Trout","category":"fish","calories":190,"protein":20.0,"carbs":0,"fat":10.0},
    {"name":"Shrimp","category":"fish","calories":106,"protein":24.0,"carbs":0.4,"fat":0.5},
    {"name":"Egg (Whole)","category":"dairy","calories":155,"protein":13.0,"carbs":1.1,"fat":11.0},
    {"name":"Greek Yogurt","category":"dairy","calories":97,"protein":9.0,"carbs":6,"fat":5.0},
    {"name":"Milk (Whole)","category":"dairy","calories":61,"protein":3.2,"carbs":4.8,"fat":3.3},
    {"name":"Cheddar Cheese","category":"dairy","calories":403,"protein":25.0,"carbs":1.3,"fat":33.0},
    {"name":"White Rice","category":"grains","calories":130,"protein":2.7,"carbs":28,"fat":0.3},
    {"name":"Oats","category":"grains","calories":71,"protein":2.5,"carbs":12,"fat":1.4},
    {"name":"Whole Wheat Bread","category":"grains","calories":247,"protein":13.0,"carbs":41,"fat":4.0},
    {"name":"Sweet Potato","category":"grains","calories":90,"protein":2.0,"carbs":21,"fat":0.1},
    {"name":"Pasta (Cooked)","category":"grains","calories":158,"protein":5.8,"carbs":31,"fat":0.9},
    {"name":"Lentils (Cooked)","category":"legumes","calories":116,"protein":9.0,"carbs":20,"fat":0.4},
    {"name":"Chickpeas (Cooked)","category":"legumes","calories":164,"protein":8.9,"carbs":27.4,"fat":2.6},
    {"name":"Black Beans (Cooked)","category":"legumes","calories":132,"protein":8.9,"carbs":23.7,"fat":0.5}
];

const state = {
    nutrient: null,
    category: null,
    sortedFoods: [],
    currentFood: null,
    lives: 4,
    round: 0,
    feedback: null,
    waitingForNext: false
};

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById('screen-' + name);
    if (target) target.classList.remove('hidden');
}

function renderCategories() {
    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'card';
        btn.textContent = cat.label;
        btn.addEventListener('click', () => selectCategory(cat.id));
        grid.appendChild(btn);
    });
}

function bindEvents() {
    document.getElementById('btn-start').addEventListener('click', () => {
        loadSettings();
        showScreen('nutrient');
    });

    document.getElementById('btn-back-nutrient').addEventListener('click', () => showScreen('home'));
    document.getElementById('btn-back-category').addEventListener('click', () => showScreen('nutrient'));

    document.querySelectorAll('[data-nutrient]').forEach(btn => {
        btn.addEventListener('click', () => selectNutrient(btn.dataset.nutrient));
    });

    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => selectCategory(btn.dataset.category));
    });

    document.getElementById('btn-next').addEventListener('click', nextRound);
    document.getElementById('btn-restart').addEventListener('click', restart);
}

function loadSettings() {
    const savedNutrient = localStorage.getItem('nutritionGame_nutrient');
    if (savedNutrient && NUTRIENTS[savedNutrient]) {
        state.nutrient = savedNutrient;
        highlightNutrient(savedNutrient);
    }
    const savedCategory = localStorage.getItem('nutritionGame_category');
    if (savedCategory) {
        // Pre-select logic could go here, but we just show category screen normally
    }
}

function highlightNutrient(nutrient) {
    document.querySelectorAll('[data-nutrient]').forEach(btn => {
        if (btn.dataset.nutrient === nutrient) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

function selectNutrient(nutrient) {
    state.nutrient = nutrient;
    localStorage.setItem('nutritionGame_nutrient', nutrient);
    showScreen('category');
}

function selectCategory(category) {
    state.category = category;
    localStorage.setItem('nutritionGame_category', category);
    if (!foods || foods.length === 0) {
        alert('Food data not loaded yet. Please try again in a moment.');
        return;
    }
    startGame();
}

function getFilteredFoods() {
    if (!state.category || state.category === 'all') return [...foods];
    return foods.filter(f => f.category === state.category);
}

function startGame() {
    const pool = getFilteredFoods();
    if (pool.length < 2) {
        alert('Not enough foods in this category. Please choose another.');
        showScreen('category');
        return;
    }

    state.sortedFoods = [];
    state.lives = 4;
    state.round = 0;
    state.feedback = null;
    state.waitingForNext = false;

    // Pick initial food and place it automatically
    const initial = pickRandomFood(pool, []);
    state.sortedFoods.push(initial);

    nextRound();
    showScreen('game');
}

function pickRandomFood(pool, usedNames) {
    const usedSet = new Set(usedNames);
    let available = pool.filter(f => !usedSet.has(f.name));
    if (available.length === 0) available = [...pool];
    return available[Math.floor(Math.random() * available.length)];
}

function nextRound() {
    state.feedback = null;
    state.waitingForNext = false;

    const pool = getFilteredFoods();
    const usedNames = state.sortedFoods.map(f => f.name);
    state.currentFood = pickRandomFood(pool, usedNames);

    state.round++;
    renderGame();
}

function getCorrectIndex() {
    const val = state.currentFood.values[state.nutrient];
    let idx = 0;
    for (let i = 0; i < state.sortedFoods.length; i++) {
        if (state.sortedFoods[i].values[state.nutrient] <= val) {
            idx = i + 1;
        } else {
            break;
        }
    }
    return idx;
}

function placeFood(playerIndex) {
    if (state.waitingForNext) return;

    const correctIndex = getCorrectIndex();
    const isCorrect = playerIndex - 1 === correctIndex;

    if (!isCorrect) {
        state.lives--;
        if (state.lives <= 0) {
            endGame();
            return;
        }
    }

    // Insert at correct position to maintain sorted order
    state.sortedFoods.splice(correctIndex, 0, state.currentFood);

    const val = state.currentFood.values[state.nutrient];
    const daily = NUTRIENTS[state.nutrient].daily;
    const percent = ((val / daily) * 100).toFixed(1);

    state.feedback = {
        correct: isCorrect,
        correctIndex: correctIndex + 1,
        value: val,
        percent: percent,
        unitLabel: NUTRIENTS[state.nutrient].label,
        unit: NUTRIENTS[state.nutrient].unit,
        foodName: state.currentFood.name
    };

    state.waitingForNext = true;
    renderGame();
}

function endGame() {
    const msg = document.getElementById('gameover-message');
    msg.innerHTML = `You placed <strong>${state.sortedFoods.length}</strong> foods correctly.<br>Category: ${CATEGORIES.find(c => c.id === state.category)?.label || state.category}`;
    showScreen('gameover');
}

function restart() {
    showScreen('nutrient');
}

function renderGame() {
    // Lives
    const heartsEl = document.getElementById('hearts');
    heartsEl.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        span.textContent = '❤️';
        if (i >= state.lives) span.classList.add('lost');
        heartsEl.appendChild(span);
    }
    document.getElementById('lives-count').textContent = state.lives;

    // Round info
    document.getElementById('round-number').textContent = state.round;
    // List
    const listEl = document.getElementById('list-container');
    listEl.innerHTML = '';

    state.sortedFoods.forEach((food, idx) => {
        const item = document.createElement('div');
        item.className = 'list-item';

        // Highlight if feedback exists
        if (state.feedback && state.currentFood && food.name === state.currentFood.name) {
            if (state.feedback.correct) {
                item.classList.add('correct');
            } else {
                item.classList.add('incorrect-new');
            }
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'list-item-name';
        nameSpan.textContent = food.name;

        const valSpan = document.createElement('span');
        valSpan.className = 'list-item-value';
        valSpan.textContent = `${food.values[state.nutrient]} ${NUTRIENTS[state.nutrient].unit}`;

        item.appendChild(nameSpan);
        item.appendChild(valSpan);

        // Make list items tappable as target positions (insert above)
        item.addEventListener('click', () => {
            if (state.waitingForNext) return;
            const slotIndex = idx + 1; // insert above this item = position index in 1-based
            placeFood(slotIndex);
        });

        listEl.appendChild(item);
    });

    // New food area
    const newFoodArea = document.getElementById('new-food-area');
    const feedbackArea = document.getElementById('feedback-area');
    const btnNext = document.getElementById('btn-next');
    const positionsArea = document.getElementById('positions-area');

    if (state.feedback) {
        // Show feedback
        newFoodArea.classList.add('hidden');
        positionsArea.classList.add('hidden');
        feedbackArea.classList.remove('hidden');
        btnNext.classList.remove('hidden');

        const titleEl = document.getElementById('feedback-title');
        titleEl.textContent = state.feedback.correct ? 'Correct! 🎉' : 'Wrong! ❌';

        feedbackArea.classList.remove('correct', 'incorrect');
        feedbackArea.classList.add(state.feedback.correct ? 'correct' : 'incorrect');

        const detailsEl = document.getElementById('feedback-details');
        detailsEl.innerHTML = `
            <div><strong>${state.feedback.foodName}</strong> → Position ${state.feedback.correctIndex}</div>
            <div class="food-stat"><strong>${state.feedback.value} ${state.feedback.unit}</strong></div>
            <div class="food-stat"><strong>${state.feedback.percent}%</strong> of daily intake</div>
            <div class="feedback-explanation">${state.feedback.correct ? 'Nice! Your intuition is on point.' : 'Check the order carefully and try again!'}</div>
        `;

        // If incorrect and food was placed, highlight it in list
        if (!state.feedback.correct) {
            // Already handled in list rendering above
        }

    } else {
        // Show placement UI
        newFoodArea.classList.remove('hidden');
        positionsArea.classList.remove('hidden');
        feedbackArea.classList.add('hidden');
        btnNext.classList.add('hidden');

        document.getElementById('new-food-name').textContent = state.currentFood.name;

        // Position buttons
        const posContainer = document.getElementById('position-buttons');
        posContainer.innerHTML = '';

        const hint = document.querySelector('.position-hint');
        if (hint) hint.textContent = `Tap to place before an item, or use the buttons below`;

        for (let i = 1; i <= state.sortedFoods.length + 1; i++) {
            const btn = document.createElement('button');
            btn.className = 'position-btn';
            btn.textContent = i;
            btn.addEventListener('click', () => placeFood(i));
            posContainer.appendChild(btn);
        }
    }
}

function init() {
    bindEvents();
    fetch('foods.json')
        .then(r => {
            if (!r.ok) throw new Error('Failed to load foods.json');
            return r.json();
        })
        .then(data => {
            foods = data.foods || data || [];
            renderCategories();
        })
        .catch(err => {
            console.warn('Loading foods.json failed, using bundled data:', err);
            foods = DEFAULT_FOODS;
            renderCategories();
        });
}

document.addEventListener('DOMContentLoaded', init);
