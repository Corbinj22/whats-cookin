const page = document.querySelector('body');
const homePage = document.querySelector('.home-page');
const favoritesPage = document.querySelector('.favorites-page');
const mealPage = document.querySelector('.meal-page');
const mealContainer = document.getElementById('meal-container');


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
        <img id="${recipe.name}" class="icon active hidden"src="https://img.icons8.com/color/96/000000/hearts.png"/>
        <img id="${recipe.name}" class="icon inactive" src="https://img.icons8.com/windows/96/000000/hearts.png"/>
        <img id="${recipe.name}" class="icon cook-ready" src="https://img.icons8.com/doodle/96/000000/pot---v1.png"/>
      </div>
    </div>`
  }
}

page.addEventListener('click', clickHandler)

window.onload = load();

function load() {
  // mind the order of the functions on load
  showMeals();
  loadUser()
}

function clickHandler(event) {
  event.target.classList.contains('home-btn') ? displayHomePage() : null;
  event.target.classList.contains('favorites-btn') ? displayFavoritesPage() : null;
  event.target.classList.contains('food-img') ? displayMealPage() : null;
  // event.target.classList.contains()

  // if event target is favorites heart - call user method addtofaves
  // if card is already in add to faves - then PUSH OUT of faves and change heart
  // if event target is add BTN - call user method addMealToCook
  // meal card click handler can have event.target.closest('.meal-card')
  // depending on the meal card "closest" selected, it should populate on meal page
 }

function loadUser() {
  // randomize user selection
  console.log(usersData);
  let userSelected = usersData[Math.floor(Math.random() * usersData.length)]
  console.log(userSelected.name);
  user = new User(userSelected);
  console.log('three', user);
  // return the user
  return user
}

function showMeals() {
  recipeData.forEach(recipe => {
   mealContainer.insertAdjacentHTML('afterbegin', domMeals.displayMeals(recipe))
  })
}

function displayHomePage() {
  homePage.classList.remove('hidden');
  favoritesPage.classList.add('hidden');
  mealPage.classList.add('hidden')
}

function displayFavoritesPage() {
  favoritesPage.classList.remove('hidden');
  homePage.classList.add('hidden');
  mealPage.classList.add('hidden')
}

function displayMealPage() {
  mealPage.classList.remove('hidden')
  homePage.classList.add('hidden');
  favoritesPage.classList.add('hidden');
}

function filterByType() {
   // add a switch function to handle the possibilities of the filter to have multiple values responde the same (ex. main course, dinner is the same shit. same as antipasto and antipasti for fucks sake)
}
