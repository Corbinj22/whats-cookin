class Recipe {
  constructor(recipeDetails) {
    this.id = recipeDetails.id;
    this.image = recipeDetails.image;
    this.ingredients = recipeDetails.ingredients;
    this.instructions = recipeDetails.instructions;
    this.name = recipeDetails.name;
    this.tags = recipeDetails.tags;
    this.favorite = false;
  }

  changeFavoriteStatus() {
    if (!this.favorite) {
      this.favorite = true;
    } else {
      this.favorite = false;
    }
  }

  getTotalCost(allIngredients) {
    const formattedIngredients = this.ingredients.reduce((acc, ingredient) => {
      const ingredientObj = {}
      ingredientObj['id'] = ingredient.id
      ingredientObj['amount'] = ingredient.quantity.amount
      acc.push(ingredientObj)
      return acc
    }, [])

    const totalCost = formattedIngredients.reduce((acc, ingredient) => {
      const targetIngredient = allIngredients.find(ingredientDatum => 
        ingredientDatum.id === ingredient.id)
      acc += (targetIngredient.estimatedCostInCents * ingredient.amount)
      return acc;
    }, 0)
    return totalCost
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Recipe;
}
