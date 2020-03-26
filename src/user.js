const Pantry = require('../src/pantry');
// const Recipe = require('../src/recipe');

class User {
  constructor(obj) {
    this.name = obj.name;
    this.id = obj.id;
    this.pantry = new Pantry(obj.pantry);
    this.favorites = [];
  }

  addToFavorites(recipe) {
    //adds recipe to the favorites array
    this.favorites.push(recipe)

  }

  removeFromFavorites() {
    // thinking we can validate if it pushes or takes out 
    // within the add to favorites method

    // removes recipe from favorites array
  }
}

module.exports = User;

// if (typeof module !== ‘undefined’) {
//   module.exports = User;
// }