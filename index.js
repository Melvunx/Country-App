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

// Fonction pour surligner les caractères correspondants
const highlightSearchTerm = (name, searchTerm) => {
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return name.replace(regex, "<span class='highlight'>$1</span>");
};

// Fonction pour afficher les pays
const displayCountries = (countries, searchValue) => {
  countriesContainer.innerHTML = countries
    .map((country) => {
      const countryName = highlightSearchTerm(country.name.common, searchValue);

      return `
        <div class="country">
          <div class="card">
            <div class="img-container">
              <img src=${country.flags.png} alt=${country.flags.alt}>
            </div>
            <div class="card-content">
              <h2>${countryName}</h2>
              <h3>Capital : ${country.capital}</h3>
              <p>Population : ${country.population
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</p>
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
  if (countriesToDisplay.length > 0) {
    displayCountries(countriesToDisplay, searchValue);
  } else {
    countriesContainer.innerHTML = `<h1 class="noRes"> Aucun résultat </h1>`;
  }
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

// Fonction principale pour gérer les événements de tri
const countryDisplay = async () => {
  await fetchCountry();

  // Trier par population croissante
  minToMax.addEventListener("click", () => {
    displayCountries(acsSort(), inputSearch.value.toLowerCase());
    console.log("sort asc");
  });

  // Trier par population décroissante
  maxToMin.addEventListener("click", () => {
    displayCountries(descSort(), inputSearch.value.toLowerCase());
    console.log("sort desc");
  });

  // Trier par ordre alphabétique
  alpha.addEventListener("click", () => {
    displayCountries(alphaSort(), inputSearch.value.toLowerCase());
    console.log("sorted by alphabet");
  });

  // Affichage initial avec tous les pays
  filterCountries();
};

// Fonctions de tri
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

countryDisplay();
