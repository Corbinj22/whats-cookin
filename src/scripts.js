const page = document.querySelector('body');
const homePage = document.querySelector('.home-page');
const favoritesPage = document.querySelector('#favorites-page');
const mealPage = document.querySelector('.meal-page');
const mealContainer = document.getElementById('meal-container');
const filterDropDown = document.querySelector('.type-selection');
const searchBar = document.querySelector('#search-bar');

let recipes;

let domMeals = {
  displayMeals(recipe) {
    return `
    <div id="${recipe.id}" class='meal-card'>
      <div id="${recipe.id}" class='card-title-container'>
        <p class='card-title'>${recipe.name}</p>
      </div>
      <div id="${recipe.id}"class="food-img-container">
        <img id="${recipe.id}" class="food-img" rel="food-img" src="${recipe.image}">
      </div>
      <div class="card-icon-container">
        <img id="${recipe.id}" class="favorite-icon-active hidden ${recipe.name}"src="https://img.icons8.com/color/96/000000/hearts.png"/>
        <img id="${recipe.id}" class="favorite-icon-inactive ${recipe.name}" src="https://img.icons8.com/windows/96/000000/hearts.png"/>
        <img id="${recipe.id}" class="icon cook-ready ${recipe.name}" src="https://img.icons8.com/doodle/96/000000/pot---v1.png"/>
      </div>
    </div>`
  }
}



filterDropDown.addEventListener('change', filterByType)
page.addEventListener('click', clickHandler)
mealContainer.addEventListener('click', toggleFavorite)

searchBar.addEventListener('keyup', (e) => {
  // lowerCase makes the value lowercase regardless of input
  const searchItem = e.target.value.toLowerCase();
  // need to declar a variable that contains all titles of meals isntead of MEAL TITLES on filter
  const filteredMeals = mealTitles.filter(meal => {
    return meal.title.toLowerCase().includes(searchItem)
  })
  // this should give us all the meals that match the characters
  return filteredMeals
  // probably pass this results of filteredMeals in a displaySearched()
})


window.onload = load();

function load() {
  showMeals(recipeData);
  loadUser()
}

function clickHandler(event) {
  let target = event.target;
  event.target.classList.contains('home-btn') ? displayHomePage() : null;
  event.target.classList.contains('favorites-btn') ? displayFavoritesPage() : null;
  event.target.classList.contains('food-img') ? displayMealPage(event) : null;
  event.target.classList.contains('favorite-icon-inactive') ? addMealToFavorites(target) : null;
  event.target.classList.contains('favorite-icon-active') ? removeMealFromFavorites(target) : null;
}

function loadUser() {
  let userSelected = usersData[Math.floor(Math.random() * usersData.length)]
  user = new User(userSelected, Pantry);
  user.pantry.getIngredientDetails(ingredientsData)
  return user
}

function loadFavorites(recipe) {
  return `
  <div id="${recipe.id}" class='meal-card'>
    <div id="${recipe.id}" class='card-title-container'>
      <p class='card-title'>${recipe.name}</p>
    </div>
    <div id="${recipe.id}"class="food-img-container">
      <img id="${recipe.id}" class="food-img" rel="food-img" src="${recipe.image}">
    </div>
    <div class="card-icon-container">
      <img id="${recipe.id}" class="favorite-icon"src="https://img.icons8.com/windows/96/000000/hearts.png"/>
      <img id="${recipe.id}" class="icon cook-ready ${recipe.name}" src="https://img.icons8.com/doodle/96/000000/pot---v1.png"/>
    </div>
  </div>`
}

let domSelectedMeal = {
  loadSelectedRecipe(recipe) {
    let missingItems = user.pantry.requiredForMeal(recipe);
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
        <p>Your pantry is missing the following ingredient(s) to cook this meal:</p>
        <p></p>
      </div>
      <div class="missing-ingredients">
        <ul class="missing-list">
          <li>${missingItems}</li>
          <p class="total-cost">Approximate total cost to cook meal: ${Math.floor(recipe.getTotalCost(ingredientsData))} ¢</p>
        </ul>
      </div>
    </div>
    <div class="cooking-instructions">
    <p class="cooking-details">${recipe.instructions.map(step => step.instruction)}</p>
    </div>`
  }
}

function showMeals(mealData) {
  recipes = mealData.map(recipe => {
    mealContainer.insertAdjacentHTML('afterbegin', domMeals.displayMeals(recipe))
    return new Recipe(recipe)
  })
}

function displayHomePage() {
  // showMeals(recipeData)
  // ^^^ gonna take this bugger out - creates favorites bug
  homePage.classList.remove('hidden');
  favoritesPage.classList.add('hidden');
  mealPage.classList.add('hidden');
  mealPage.innerHTML = " ";
}

// changed line 126 from this.user - to user
function displayFavoritesPage() {
  favoritesPage.innerHTML = " ";
  // favorites =     this is not needed
  user.favorites.map(recipe => {
    favoritesPage.insertAdjacentHTML('afterbegin', loadFavorites(recipe));
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

function removeMealFromFavorites(target) {
  let targetRecipe = recipes.find(recipe => {
    return recipe.id == target.id
  })
  let targetValidate = user.favorites.find(meal => {
    if (meal.id === targetRecipe.id) {
      return false
    }
    if (!targetValidate) {  
      let repeated = user.favorites.indexOf('targetValidate');
      user.favorites.splice(repeated, 1);
    }
  })
}

function addMealToFavorites(target) {
  let targetRecipe = recipes.find(recipe => {
    return recipe.id == target.id
  })
  favoriteValidate(targetRecipe);
};

function favoriteValidate(targetRecipe) {
  !user.favorites.includes(targetRecipe) ? user.addToFavorites(targetRecipe) : null;
}

function toggleFavorite(event) {
  if(event.target.classList.contains('favorite-active')) {
    event.target.classList.remove('favorite-active')
    event.target.src = "https://img.icons8.com/color/96/000000/hearts.png";
  } else {
    event.target.src = "https://img.icons8.com/windows/96/000000/hearts.png"
    event.target.classList.add('favorite-active')
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
    displayHomePage()
  } else {
    mealContainer.innerHTML = " ";
    showMeals(filteredRecipes)
  }
}
