        const recipeGrid = document.getElementById("recipeGrid");
        const recipeDetails = document.getElementById("recipeDetails");
        const searchInput = document.getElementById("searchInput");
        const themeToggle = document.querySelector(".theme-toggle");

        async function fetchDefaultRecipes() {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
            const data = await response.json();
            displayRecipes(data.meals.slice(0, 6)); 
        }

        async function searchRecipes() {
            const query = searchInput.value.trim();
            if (!query) return;

            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            displayRecipes(data.meals);
        }

        async function getRandomRecipe() {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            const data = await response.json();
            displayRecipes(data.meals);
        }

        function displayRecipes(meals) {
            if (!meals) {
                recipeGrid.innerHTML = "<p>No recipes found. Try another search!</p>";
                return;
            }

            recipeGrid.innerHTML = meals.map(meal => `
                <div class="recipe-card" onclick="showRecipeDetails('${meal.idMeal}')">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            `).join("");
        }

        async function showRecipeDetails(id) {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            const meal = data.meals[0];

            document.getElementById("detailImage").src = meal.strMealThumb;
            document.getElementById("detailTitle").textContent = meal.strMeal;

            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
                }
            }
            document.getElementById("detailIngredients").innerHTML = ingredients.map(ing => `<li>${ing}</li>`).join("");

            document.getElementById("detailInstructions").innerHTML = meal.strInstructions.split("\n").map(step => `<li>${step}</li>`).join("");

            recipeDetails.classList.add("active");
        }

        function closeDetails() {
            recipeDetails.classList.remove("active");
        }

        function toggleTheme() {
            document.body.classList.toggle("dark-mode");
            const icon = themeToggle.querySelector("i");
            icon.classList.toggle("fa-moon");
            icon.classList.toggle("fa-sun");
        }

        fetchDefaultRecipes();
