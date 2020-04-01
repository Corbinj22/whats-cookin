const page = document.querySelector('body');
const homePage = document.querySelector('.home-page');
const favoritesPage = document.querySelector('#favorites-page');
const mealPage = document.querySelector('.meal-page');
const mealContainer = document.getElementById('meal-container');
const filterDropDown = document.querySelector('.type-selection');
const unfavorited = document.querySelector('#favorite-icon-inactive clickedIcon');
const favorited = document.querySelector('#favorite-icon-active clickedIcon');

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

  // if event target is favorites heart - call user method addtofaves
  // if card is already in add to faves - then PUSH OUT of faves and change heart
  // if event target is add BTN - call user method addMealToCook
  // meal card click handler can have event.target.closest('.meal-card')
  // depending on the meal card "closest" selected, it should populate on meal page
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
      <img id="${recipe.id}" class="favorite-icon-active hidden ${recipe.name}"src="https://img.icons8.com/color/96/000000/hearts.png"/>
      <img id="${recipe.id}" class="favorite-icon-inactive ${recipe.name}" src="https://img.icons8.com/windows/96/000000/hearts.png"/>
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
  console.log('recipe picked', targetRecipe)
  let targetValidate = user.favorites.find(meal => {
    if (meal.id === targetRecipe.id) {
      console.log('which meal', meal.id)
      return false
    }
    console.log('Validate', targetValidate)
    
    if (!targetValidate) {  
      
      let repeated = user.favorites.indexOf('targetValidate');
      user.favorites.splice(repeated, 1);
    }
  })
  // do i need to favoriteValidate here?
  // toggle hide/show 
}


// maybe should put a toggle on heart showing up and that belonging to the favorites array
function addMealToFavorites(target) {
  let targetRecipe = recipes.find(recipe => {
    return recipe.id == target.id
  })
  favoriteValidate(targetRecipe);
  toggleFavorite(targetRecipe);
  // if(!user.favorites.includes(targetRecipe) 
  //   user.addToFavorites(targetRecipe)
  
};

function favoriteValidate(targetRecipe) {
  !user.favorites.includes(targetRecipe) ? user.addToFavorites(targetRecipe) : null;
}

function toggleFavorite(targetRecipe) {
  // run a find over the cards to find the one that contains/includes the event.target.id
  // if it does not contain the active heart , then hide/show toggle
  // that return get the affected 
  let clickedIcon = event.target.id
  let inactiveIcon = document.getElementsByClassName('favorite-icon-inactive')
  // let formatted = inactiveIcon.reduce((acc, img) => {
    
  //   return acc
  // }, '')
  // let cardSelected = inactiveIcon.find(card => {
  //   return  card.id === clickedIcon;
  // }) 
  



  // grab icon 
  // console.log('clicked thing', targetRecipe)
  // let clickedIcon = event.target.id;
  // console.log('three', clickedIcon)
  // // let activeIcon = document.getElementsByClassName('favorite-icon-active')
  // console.log('one', unfavorited);
  // console.log('two', favorited);

  // if (targetRecipe.id === clickedIcon) {
  //   unfavorited.classList.add('hidden');
  //   favorited.classList.remove('hidden');
  // }

  // let toggle = activeIcon.indexOf(clickedIcon)
  // console.log('toggle', toggle)
  // if (toggle > 0) {
  //   inactiveIcon.classList.add('hidden')
  //   activeIcon.classList.remove('hidden')
  // }
  // console.log("toggle", toggle)
  // if (toggle === )



  // if (clickedIcon === inactiveIcon.id) {
  //   console.log(event.target);
  //   inactiveIcon.classList.add('hidden')
  //   activeIcon.classList.remove('hidden')
  // } else {
  //   activeIcon.classList.add('hidden')
  //   inactiveIcon.classList.remove('hidden')
  // }
  // on click add hide to icon and toggle to other icon
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

// function searchBar() {
//
// }
