// assets/js/propertyGrid.js
// Handle property search and display latest properties

let allProperties = [];

async function loadProperties() {
    allProperties = await fetchProperties(propertyFiles);
    displayLatestProperties();
    setupSearch();
}

function displayLatestProperties() {
    const latestPropertiesSection = document.querySelector('#property-carousel .swiper-wrapper');
    const latestProperties = allProperties.slice(-5).reverse(); // Get the last 5 properties
    latestProperties.forEach(property => {
        const propertyElement = createPropertyElement(property);
        latestPropertiesSection.appendChild(propertyElement);
    });
}

function setupSearch() {
    const searchInput = document.querySelector('#keyword');
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
    element.className = 'swiper-slide';
    element.innerHTML = `
        <div class="card-box-a card-shadow">
            <div class="img-box-a">
                <img src="${property.image}" alt="${property.name}" class="img-a img-fluid">
                <div class="ribbon">Novo</div>
            </div>
            <div class="card-overlay">
                <div class="card-overlay-content">
                    <div class="card-header-a">
                        <h2 class="card-title-a">
                            <a href="property-single.html?id=${property.id}">${property.name}</a>
                        </h2>
                    </div>
                    <div class="card-body-a">
                        <div class="price-box">
                            <span class="price-a">R$ ${property.price}</span>
                        </div>
                        <a href="property-single.html?id=${property.id}" class="link-a">Ver Detalhes
                            <span class="bi bi-chevron-right"></span>
                        </a>
                    </div>
                    <div class="card-footer-a">
                        <ul class="card-info d-flex justify-content-around">
                            <li>
                                <h4 class="price-title">Quartos</h4>
                                <span>${property.bedrooms}</span>
                            </li>
                            <li>
                                <h4 class="price-title">Banheiros</h4>
                                <span>${property.bathrooms}</span>
                            </li>
                            <li>
                                <h4 class="price-title">Garagens</h4>
                                <span>${property.garages}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    return element;
}

document.addEventListener('DOMContentLoaded', loadProperties);
