document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.getElementById("home");
    const searchSection = document.getElementById("search");
    const detailsSection = document.getElementById("cocktail-details");

    const homeLink = document.getElementById("home-link");
    const searchLink = document.getElementById("search-link");

    const randomCocktailImg = document.getElementById("random-cocktail-img");
    const randomCocktailName = document.getElementById("random-cocktail-name");
    const newCocktailBtn = document.getElementById("new-cocktail-btn");
    const seeMoreBtn = document.getElementById("see-more-btn");

    const searchInput = document.getElementById("search-input");
    const searchForm = document.querySelector("#search-form form");
    const searchResults = document.getElementById("search-results");

    let currentCocktail = null;

    const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

    function showSection(section) {
        homeSection.style.display = section === "home" ? "block" : "none";
        searchSection.style.display = section === "search" ? "block" : "none";
        detailsSection.style.display = section === "details" ? "block" : "none";
    }

    function fetchRandomCocktail() {
        fetch(`${API_BASE}/random.php`)
            .then((response) => response.json())
            .then((data) => {
                const cocktail = data.drinks[0];
                currentCocktail = cocktail;

                randomCocktailImg.src = cocktail.strDrinkThumb;
                randomCocktailName.textContent = cocktail.strDrink;
            })
            .catch((error) => console.error("Error finding random cocktail:", error));
    }

    function showCocktailDetails(cocktail) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${ingredient} - ${measure || "As needed"}`);
            }
        }

        detailsSection.innerHTML = `
            <h2>${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <p><strong>Category:</strong> ${cocktail.strCategory || "N/A"}</p>
            <p><strong>Instructions:</strong> ${cocktail.strInstructions || "N/A"}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${ingredients.map((item) => `<li>${item}</li>`).join("")}
            </ul>
        `;
        showSection("details");
    }

    function searchCocktails(query) {
        fetch(`${API_BASE}/search.php?s=${query}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.drinks) {
                    searchResults.innerHTML = data.drinks
                        .map(
                            (drink) => `
                            <div class="cocktail-item" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                                <h3>${drink.strDrink}</h3>
                            </div>`
                        )
                        .join("");
                } else {
                    searchResults.innerHTML = "<p>No cocktails found.</p>";
                }
            })
            .catch((error) => console.error("Error searching cocktails:", error));
    }

    homeLink.addEventListener("click", () => showSection("home"));
    searchLink.addEventListener("click", () => showSection("search"));

    newCocktailBtn.addEventListener("click", fetchRandomCocktail);

    seeMoreBtn.addEventListener("click", () => {
        if (currentCocktail) {
            showCocktailDetails(currentCocktail);
        }
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            searchCocktails(query);
        }
    });

    searchResults.addEventListener("click", (e) => {
        const cocktailItem = e.target.closest(".cocktail-item");
        if (cocktailItem) {
            const cocktailId = cocktailItem.getAttribute("data-id");
            fetch(`${API_BASE}/lookup.php?i=${cocktailId}`)
                .then((response) => response.json())
                .then((data) => showCocktailDetails(data.drinks[0]))
                .catch((error) => console.error("Error finding cocktail details:", error));
        }
    });

    fetchRandomCocktail();
});
