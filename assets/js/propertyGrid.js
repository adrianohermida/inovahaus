// assets/js/propertyGrid.js
// Handle property search and display latest properties

let allProperties = [];

async function loadProperties() {
    allProperties = await fetchProperties(propertyFiles);
    displayLatestProperties();
    setupSearch();
}

function displayLatestProperties() {
    const latestPropertiesSection = document.querySelector('#latest-properties');
    const latestProperties = allProperties.slice(-5).reverse(); // Get the last 5 properties
    latestProperties.forEach(property => {
        const propertyElement = createPropertyElement(property);
        latestPropertiesSection.appendChild(propertyElement);
    });
}

function setupSearch() {
    const searchInput = document.querySelector('#property-search');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProperties = allProperties.filter(property => property.name.toLowerCase().includes(searchTerm));
        displaySearchResults(filteredProperties);
    });
}

function displaySearchResults(properties) {
    const searchResultsSection = document.querySelector('#search-results');
    searchResultsSection.innerHTML = ''; // Clear previous results
    properties.forEach(property => {
        const propertyElement = createPropertyElement(property);
        searchResultsSection.appendChild(propertyElement);
    });
}

function createPropertyElement(property) {
    const element = document.createElement('div');
    element.className = 'property';
    element.innerHTML = `
        <h2>${property.name}</h2>
        <p>${property.description}</p>
        <p>Price: ${property.price}</p>
    `;
    return element;
}

document.addEventListener('DOMContentLoaded', loadProperties);
