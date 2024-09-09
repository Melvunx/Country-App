const countriesContainer = document.querySelector(".countries-container");

let countryData = [];

// Fonction pour récupérer les données des pays
const fetchCountry = async () => {
  await fetch("https://restcountries.com/v3.1/all").then((res) =>
    res.json().then((data) => {
      countryData = data;
    })
  );
};

// Fonction pour afficher les pays
const countryDisplay = async () => {
  await fetchCountry();

  const displayCountries = (countries) => {
    countriesContainer.innerHTML = countries
      .map((country) => {
        return `
          <div class="country">
            <div class="card">
              <div class="img-container">
                <img src=${country.flags.png} alt=${country.flags.alt}>
              </div>
              <div class="card-content">
                <p>Population : ${country.population
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</p>
                <h2>${country.name.common}</h2>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  };

  // Filtrer les pays en fonction de l'input de recherche
  const filterCountries = () => {
    const searchValue = inputSearch.value.toLowerCase();
    const filteredCountries = countryData.filter((country) =>
      country.name.common.toLowerCase().includes(searchValue)
    );
    const countriesToDisplay = filteredCountries.slice(0, inputRange.value);
    displayCountries(countriesToDisplay);
  };

  // Gérer la mise à jour du nombre de pays affichés
  inputRange.addEventListener("input", (e) => {
    rangeValue.textContent = e.target.value;
    filterCountries();
  });

  // Gérer la recherche des pays en fonction de la saisie utilisateur
  inputSearch.addEventListener("input", () => {
    filterCountries();
  });

  const acsSort = () => {
    return countryData.sort((a, b) => a.population - b.population);
  };

  const descSort = () => {
    return countryData.sort((a, b) => b.population - a.population);
  };

  const alphaSort = () => {
    return countryData.sort((a, b) => {
      if (a.name.common < b.name.common) {
        return -1;
      } else if (a.name.common > b.name.common) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  minToMax.addEventListener("click", () => {
    displayCountries(acsSort());
    console.log("sort asc");
  });

  maxToMin.addEventListener("click", () => {
    displayCountries(descSort());
    console.log("sort desc");
  });

  alpha.addEventListener("click", () => {
    displayCountries(alphaSort());
    console.log("sorted by alphabet");
  });

  // Affichage initial avec tous les pays
  filterCountries();
};

countryDisplay();
