
class User {
  constructor(obj, Pantry) {
    this.name = obj.name;
    this.id = obj.id;
    this.pantry = new Pantry(obj.pantry);
    this.favorites = [];
    this.mealsToCook = []
  }

  addToFavorites(recipe) {
    this.favorites.push(recipe)
  }

  //remove from favorites recipe. find target value and index of and splice

  addMealsToCook(recipe) {
    this.mealsToCook.push(recipe)
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = User;
}
