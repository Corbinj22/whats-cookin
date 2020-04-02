const page = document.querySelector('body');
const homePage = document.querySelector('.home-page');
const favoritesPage = document.querySelector('#favorites-page');
const mealPage = document.querySelector('.meal-page');
const mealContainer = document.getElementById('meal-container');
const filterDropDown = document.querySelector('.type-selection')
const searchBar = document.querySelector('#search-bar');

let recipes;

filterDropDown.addEventListener('change', filterByType)
page.addEventListener('click', clickHandler)
mealContainer.addEventListener('click', toggleFavorite)
searchBar.addEventListener('keyup', searchMeals)

window.onload = load();

function load() {
  loadUser()
  showMeals(recipeData);
}

function clickHandler(event) {
  let target = event.target;
  event.target.classList.contains('home-btn') ? displayHomePage() : null;
  event.target.classList.contains('favorites-btn') ? displayFavoritesPage() : null;
  event.target.classList.contains('food-img') ? displayMealPage(event) : null;
  event.target.classList.contains('icon') ? addMealToFavorites(target) : null;
  event.target.classList.contains('ready-to-cook') ? cookUserMeal(target) : null;
}

function loadUser() {
  let userSelected = usersData[Math.floor(Math.random() * usersData.length)]
  user = new User(userSelected, Pantry);
  user.pantry.getIngredientDetails(ingredientsData)
  return user
}

let domSelectedMeal = {
  loadSelectedRecipe(recipe) {
    let missingItems = user.pantry.requiredForMeal(recipe)
    let totalCents = Math.floor(recipe.getTotalCost(ingredientsData))
    let formattedCost = formatCost(totalCents);
    return `
    <div class='meal-details-picked'>
      <div class='card-title-container-picked'>
        <p>${recipe.name}</p>
      </div>
      <div class="food-img-container-picked">
        <img class="food-img-picked" rel="food-img" src="${recipe.image}">
      </div>
    </div>
    <div class="required-to-cook">
      <div class="required-title-box">
        <p>Your pantry is missing the following <br>ingredient(s) to cook this meal:</p>
        <p></p>
      </div>
      <div class="missing-ingredients">
        <ul class="missing-list">
          <li>${missingItems}</li>
          <p class="total-cost">Approximate total cost to cook meal: ${formattedCost}</p>
        </ul>
      </div>
    </div>
    <div class="cooking-instructions">
    <p class="cooking-details">${recipe.instructions.map(step => step.instruction)}</p>
    </div>`
  }
}

function displayMeals(recipe) {
  toggleCanCook(recipe);
  return `
    <div id="${recipe.id}" class='meal-card'>
      <div id="${recipe.id}" class='card-title-container'>
        <p class='card-title'>${recipe.name}</p>
      </div>
      <div id="${recipe.id}"class="food-img-container">
        <img id="${recipe.id}" class="food-img" rel="food-img" src="${recipe.image}">
      </div>
      <div class="card-icon-container">
        <img id="${recipe.id}" class="icon ${favoriteClassToggle(recipe)} ${recipe.name}" src=${imgToggle(recipe)}/>
        <img id="${recipe.id}" class="icon ${toggleCanCook(recipe)} ${recipe.name}" src="https://img.icons8.com/doodle/96/000000/pot---v1.png"/>
      </div>
    </div>`
}

function showMeals(mealData) {
  recipes = mealData.map(recipe => {
    recipe = new Recipe(recipe)
    mealContainer.insertAdjacentHTML('afterbegin', displayMeals(recipe))
    return recipe;
  })
}

function displayHomePage() {
  homePage.classList.remove('hidden');
  favoritesPage.classList.add('hidden');
  mealPage.classList.add('hidden');
  mealPage.innerHTML = " ";
}

function displayFavoritesPage() {
  favoritesPage.innerHTML = " ";
  user.favorites.map(recipe => {
    favoritesPage.insertAdjacentHTML('afterbegin', displayMeals(recipe));
  })
  favoritesPage.classList.remove('hidden');
  homePage.classList.add('hidden');
  mealPage.classList.add('hidden')
}

function displayMealPage(event) {
  let recipe = recipes.find(recipe => recipe.id == event.target.id)
  mealPage.classList.remove('hidden')
  mealPage.insertAdjacentHTML('afterbegin', domSelectedMeal.loadSelectedRecipe(recipe))
  homePage.classList.add('hidden');
  favoritesPage.classList.add('hidden');
}

function addMealToFavorites(target) {
  favoritesPage.innerHTML = ' ';
  let targetRecipe = recipes.find(recipe => {
    return recipe.id == target.id
  })
  favoriteValidate(targetRecipe);
};

function favoriteValidate(targetRecipe) {
  !user.favorites.includes(targetRecipe) ? user.addToFavorites(targetRecipe) : removeFromFavorites(targetRecipe);
}

function removeFromFavorites(recipe) {
  let unfavorited = user.favorites.indexOf(recipe)
  user.favorites.splice(unfavorited, 1)
}

function toggleFavorite(event) {
  let currentRecipe = recipes.find(recipe => recipe.id === parseInt(event.target.id))
  if (event.target.classList.contains('favorite-inactive')) {
    event.target.classList.remove('favorite-inactive')
    event.target.classList.add('favorite-active')
    event.target.src = "https://img.icons8.com/color/96/000000/hearts.png";
    currentRecipe.changeFavoriteStatus()
  } else if (event.target.classList.contains('favorite-active')) {
    event.target.src = "https://img.icons8.com/windows/96/000000/hearts.png"
    event.target.classList.add('favorite-inactive')
    event.target.classList.remove('favorite-active')
    currentRecipe.changeFavoriteStatus()
  }
}

function favoriteClassToggle(recipe) {
  if (recipe.favorite === false) {
    return "favorite-inactive"
  } else if (recipe.favorite === true) {
    return "favorite-active"
  }
}

function imgToggle(recipe) {
  if (recipe.favorite === false) {
    return "https://img.icons8.com/windows/96/000000/hearts.png"
  } else if (recipe.favorite === true) {
    return "https://img.icons8.com/color/96/000000/hearts.png"
  }
}

function filterByType() {
  let userSelection = event.target.value;
  let filteredRecipes = recipeData.reduce((acc, recipe) => {
    recipe.tags.forEach(tag => {
      if (tag === userSelection && !acc.includes(userSelection)) {
        acc.push(recipe)
      }
    })
    return acc;
  }, [])

  if (userSelection === "home") {
    mealContainer.innerHTML = " ";
    showMeals(recipeData)
  } else {
    mealContainer.innerHTML = " ";
    showMeals(filteredRecipes)
  }
}

function toggleCanCook(recipe) {
  var requiredItems = user.pantry.requiredForMeal(recipe);
  if (requiredItems.length === 0) {
    requiredItems = "ready-to-cook"
  } else {
    requiredItems = "cook-ready"
  }
  return requiredItems;
}

function cookUserMeal(target) {
  let recipeToCook = recipeData.find(recipe => recipe.id == target.id)
  user.pantry.cookMeal(recipeToCook);
  mealContainer.innerHTML = " ";
  recipes.forEach(recipe => {
    mealContainer.insertAdjacentHTML('afterbegin', displayMeals(recipe))
  })
}

function searchMeals(event) {
  const searchItem = event.target.value.toLowerCase();
  mealContainer.innerHTML = " ";
  const filteredMeals = recipes.filter(meal => {
    return meal.name.toLowerCase().includes(searchItem)
  })
  filteredMeals.map(recipe => {
    mealContainer.insertAdjacentHTML('afterbegin', displayMeals(recipe))
  })
}

function formatCost(cost) {
  return '$' + cost.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
