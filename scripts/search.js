// scripts/search.ts
console.log('hello');
import { starWars } from '../lib/star-wars.js';
const searchInput = document.querySelector(".input");
const searchInputId = document.querySelector(".inputId");
const searchButton = document.querySelector("#byQueryBtn");
const searchButtonById = document.querySelector("#byQueryId");
const deleteButton = document.querySelector(".delete");
const resultContainer = document.querySelector("#result-container");
const messageHeader = document.querySelector(".message-header > p");
const contentBlock = document.querySelector("#content");
const spinner = document.querySelector(".spinner");
const searchType = document.querySelector("#searchType");
const searchTypeId = document.querySelector("#searchTypeId");
function closeResultContainer() {
    resultContainer.style.visibility = "hidden";
    searchInput.value = "";
    searchInputId.value = "";
}
function handleError(error) {
    if (error instanceof Error) {
        messageHeader.innerHTML = `Error: ${error.name}`;
        contentBlock.innerHTML = `<p>${error.message}</p>`;
    }
}
function validateArray(array) {
    return Array.isArray(array) && array.length > 0;
}
async function getFilms(filmsUrls) {
    if (validateArray(filmsUrls)) {
        const filmsTitles = [];
        for (const url of filmsUrls) {
            const filmId = url.match(/\/([0-9]*)\/$/)?.[1];
            if (filmId) {
                const filmsData = await starWars.getFilmsById(filmId);
                filmsTitles.push(filmsData.title);
            }
        }
        return filmsTitles;
    }
    return [];
}
async function getCharacters(charactersUrls) {
    if (validateArray(charactersUrls)) {
        const charactersNames = [];
        for (const url of charactersUrls) {
            const characterId = url.match(/\/([0-9]*)\/$/)?.[1];
            if (characterId) {
                const characterData = await starWars.getCharactersById(characterId);
                charactersNames.push(characterData.name);
            }
        }
        return charactersNames;
    }
    return [];
}
async function getPlanet(planetUrl) {
    if (planetUrl) {
        const planetId = planetUrl.match(/\/([0-9]*)\/$/)?.[1];
        if (planetId) {
            const planetData = await starWars.getPlanetsById(planetId);
            return planetData.name;
        }
    }
    return "Unknown";
}
async function getSpecies(speciesUrl) {
    if (validateArray(speciesUrl)) {
        const speciesId = speciesUrl[0].match(/\/([0-9]*)\/$/)?.[1];
        if (speciesId) {
            const speciesData = await starWars.getSpeciesById(speciesId);
            return speciesData.name;
        }
    }
    return "Unknown";
}
function createInfoHTML(data, type) {
    let html = "";
    if (type === "character") {
        const characterData = data;
        html = `
      <p>Name: ${characterData.name}</p>
      <p>Height: ${characterData.height}</p>
      <p>Mass: ${characterData.mass}</p>
      <p>Hair Color: ${characterData.hair_color}</p>
      <p>Skin Color: ${characterData.skin_color}</p>
      <p>Eye Color: ${characterData.eye_color}</p>
      <p>Birth Year: ${characterData.birth_year}</p>
      <p>Gender: ${characterData.gender}</p>
      <p>Homeworld: ${characterData.homeworld}</p>
      <p>Species: ${characterData.species}</p>
      <p>Films:</p>
      <ul>
        ${Array.isArray(characterData.films)
            ? characterData.films.map((film) => `<li>${film}</li>`).join("")
            : "Unknown"}
      </ul>
      <p>Created: ${new Date(characterData.created).toLocaleString()}</p>
      <p>Edited: ${new Date(characterData.edited).toLocaleString()}</p>
    `;
    }
    if (type === "planet") {
        const planetData = data;
        html = `
      <p>Name: ${planetData.name}</p>
      <p>Rotation period: ${planetData.rotation_period}</p>
      <p>Orbital period: ${planetData.orbital_period}</p>
      <p>Diameter: ${planetData.diameter}</p>
      <p>Climate: ${planetData.climate}</p>
      <p>Gravity: ${planetData.gravity}</p>
      <p>Terrain: ${planetData.terrain}</p>
      <p>Surface water: ${planetData.surface_water}</p>
      <p>Population: ${planetData.population}</p>
      <p>Residents:</p>
       <ul>
        ${Array.isArray(planetData.residents)
            ? planetData.residents.map((people) => `<li>${people}</li>`).join("")
            : "Unknown"}
      </ul>
      <p>Films:</p>
      <ul>
        ${Array.isArray(planetData.films)
            ? planetData.films.map((film) => `<li>${film}</li>`).join("")
            : "Unknown"}
      </ul>
      <p>Created: ${new Date(planetData.created).toLocaleString()}</p>
      <p>Edited: ${new Date(planetData.edited).toLocaleString()}</p>
      `;
    }
    if (type === "species") {
        const speciesData = data;
        html = `
    <p>Name: ${speciesData.name}</p>
    <p>classification: ${speciesData.classification} </p>
    <p>designation: ${speciesData.designation}</p>
    <p>average_height: ${speciesData.average_height}</p>
    <p>skin_colors: ${speciesData.skin_colors}</p>
    <p>hair_colors: ${speciesData.hair_colors}</p>
    <p>eye_colors: ${speciesData.eye_colors}</p>
    <p>average_lifespan: ${speciesData.average_lifespan}</p>
    <p>homeworld: ${speciesData.homeworld}</p>
    <p>language: ${speciesData.language}</p>
    <p>people: </p>
      <ul>
        ${Array.isArray(speciesData.people)
            ? speciesData.people.map((people) => `<li>${people}</li>`).join("")
            : "Unknown"}
      </ul>
    <p>films: </p>
      <ul>
        ${Array.isArray(speciesData.films)
            ? speciesData.films.map((film) => `<li>${film}</li>`).join("")
            : "Unknown"}
      </ul>
    <p>created: ${new Date(speciesData.created).toLocaleString()}</p>
    <p>edited: ${new Date(speciesData.edited).toLocaleString()}</p>
    `;
    }
    return html;
}
async function searchData(query, type, id = false) {
    try {
        spinner.style.visibility = "visible";
        resultContainer.style.visibility = "hidden";
        messageHeader.innerHTML = "";
        contentBlock.innerHTML = "";
        let data;
        if (id) {
            if (type === "character")
                data = await starWars.getCharactersById(query);
            if (type === "planet")
                data = await starWars.getPlanetsById(query);
            if (type === "species")
                data = await starWars.getSpeciesById(query);
        }
        else {
            if (type === "character")
                data = await starWars.searchCharacters(query);
            if (type === "planet")
                data = await starWars.searchPlanets(query);
            if (type === "species")
                data = await starWars.searchSpecies(query);
        }
        if (id) {
            if (!data || data.detail === "Not found") {
                resultContainer.style.visibility = "visible";
                contentBlock.innerHTML = `<p>${type.charAt(0).toUpperCase() + type.slice(1)} not found</p>`;
                return;
            }
        }
        else if (!validateArray(data.results)) {
            resultContainer.style.visibility = "visible";
            contentBlock.innerHTML = `<p>${type.charAt(0).toUpperCase() + type.slice(1)} not found</p>`;
            return;
        }
        const item = id ? data : data.results[0];
        if (type === "character") {
            item.homeworld = await getPlanet(item.homeworld);
            item.species = await getSpecies(item.species);
            item.films = await getFilms(item.films);
        }
        if (type === "planet") {
            item.residents = await getCharacters(item.residents);
            item.films = await getFilms(item.films);
        }
        if (type === "species") {
            item.films = await getFilms(item.films);
            item.people = await getCharacters(item.people);
            item.homeworld = await getPlanet(item.homeworld);
        }
        resultContainer.style.visibility = "visible";
        messageHeader.innerHTML = `${item.name}`;
        contentBlock.innerHTML = createInfoHTML(item, type);
    }
    catch (error) {
        handleError(error);
    }
    finally {
        spinner.style.visibility = "hidden";
    }
}
function handleSearchButton(query, type, isIdSearch = false) {
    if (query) {
        searchData(query, type, isIdSearch);
    }
    else {
        resultContainer.style.visibility = "visible";
        messageHeader.innerHTML = "Empty query";
        contentBlock.innerHTML = `<p>Please enter a search term</p>`;
    }
}
searchButton.addEventListener("click", () => {
    const searchTypeValue = searchType.value;
    const query = searchInput.value.trim();
    handleSearchButton(query, searchTypeValue);
});
searchButtonById.addEventListener("click", () => {
    const searchTypeValueId = searchTypeId.value;
    const id = searchInputId.value.trim();
    handleSearchButton(id, searchTypeValueId, true);
});
deleteButton.addEventListener("click", () => {
    closeResultContainer();
});
