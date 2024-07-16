document.addEventListener("DOMContentLoaded", async function() {
    let allProperties = getStoredProperties();
    if (!allProperties.length) {
        const jsonFiles = [
            'assets/js/property_1_to_50.json',
            'assets/js/property_51_to_100.json',
            'assets/js/property_101_to_150.json',
            'assets/js/property_151_to_152.json'
        ];
        allProperties = await fetchAllJsonFiles(jsonFiles);
        storeProperties(allProperties);
    }

    populateFilters(allProperties);
    renderProperties(1);
    setupSearch();
});

function getStoredProperties() {
    return JSON.parse(localStorage.getItem('allProperties')) || [];
}

function storeProperties(properties) {
    localStorage.setItem('allProperties', JSON.stringify(properties));
}

function renderProperties(page, filters = {}) {
    const itemsPerPage = 6;
    const properties = getStoredProperties();
    const filteredProperties = properties.filter(property => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            if (key === 'keyword') {
                return property.title.toLowerCase().includes(filters[key].toLowerCase());
            }
            if (property[key] == null) return false;
            return property[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
        });
    });

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

    const propertyGrid = document.querySelector('.property-grid .row');
    propertyGrid.innerHTML = '';

    propertiesToShow.forEach(property => {
        const isLeilaoFinalizado = new Date(property.nextAuction) <= new Date();
        const ribbonText = isLeilaoFinalizado ? 'Finalizado' : property.state;
        const propertyElement = createPropertyGridElement(property, ribbonText);
        propertyGrid.appendChild(propertyElement);
    });

    renderPagination(filteredProperties.length, itemsPerPage);
}

function createPropertyGridElement(property, ribbonText) {
    const element = document.createElement('div');
    element.className = 'col-md-4 mb-4';
    element.innerHTML = `
        <div class="card-box-a card-shadow">
            <div class="img-box-a">
                <img src="${property.images[0] || 'placeholder.jpg'}" alt="${property.title || ''}" class="img-a img-fluid">
                <div class="ribbon">${ribbonText || ''}</div>
            </div>
            <div class="card-overlay">
                <div class="card-overlay-a-content">
                    <div class="card-header-a">
                        <h2 class="card-title-a">
                            <a href="property-single.html?id=${property.id}">${property.title || ''}
                                <br /> ${property.neighborhood || ''}, ${property.city || ''}, ${property.state || ''}</a>
                        </h2>
                    </div>
                    <div class="card-body-a">
                        <div class="price-box d-flex justify-content-between">
                            <div>
                                <span class="price-title white-text">Lance mínimo</span>
                                <span class="price-a">R$ ${property.minimumBid ? property.minimumBid.toLocaleString('pt-BR') : 'Não há resultados'}</span>
                            </div>
                            <div>
                                <span class="price-title white-text">Avaliação Mercado</span>
                                <span class="price-a">R$ ${property.marketValue ? property.marketValue.toLocaleString('pt-BR') : 'Não há resultados'}</span>
                            </div>
                        </div>
                        <a href="property-single.html?id=${property.id}" class="link-a">Saiba mais
                            <span class="bi bi-chevron-right"></span>
                        </a>
                    </div>
                    <div class="card-footer-a">
                        <ul class="card-info d-flex justify-content-around">
                            <li>
                                <h4 class="card-info-title">Área</h4>
                                <span>${property.area ? property.area + 'm<sup>2</sup>' : 'Não há resultados'}</span>
                            </li>
                            <li>
                                <h4 class="card-info-title">Quartos</h4>
                                <span>${property.bedrooms || 'Não há resultados'}</span>
                            </li>
                            <li>
                                <h4 class="card-info-title">Banheiros</h4>
                                <span>${property.bathrooms || 'Não há resultados'}</span>
                            </li>
                            <li>
                                <h4 class="card-info-title">Garagem</h4>
                                <span>${property.garages || 'Não há resultados'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    return element;
}

function renderPagination(totalItems, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationWrapper = document.querySelector('.pagination-wrapper');
    paginationWrapper.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
        paginationWrapper.insertAdjacentHTML('beforeend', pageItem);
    }

    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = parseInt(event.target.textContent);
            const filters = getFilters();
            renderProperties(currentPage, filters);
        });
    });
}

function setupSearch() {
    const searchForm = document.querySelector('#property-search-form');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const filters = getFilters();
        localStorage.setItem('propertyFilters', JSON.stringify(filters));
        renderProperties(1, filters);
    });
}

function getFilters() {
    const keyword = document.getElementById('keyword').value;
    const type = document.getElementById('type').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const garages = document.getElementById('garages').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const price = document.getElementById('price').value ? parseFloat(document.getElementById('price').value.replace('R$', '').replace(/\./g, '').replace(',', '.')) : null;
    const category = document.getElementById('category').value;

    return { keyword, type, state, city, neighborhood, bedrooms, garages, bathrooms, price, category };
}

function populateFilters(data) {
    const populateSelect = (select, values) => {
        select.innerHTML = '<option value="">Todos</option>';
        const counts = values.reduce((acc, value) => {
            if (value) {
                acc[value] = (acc[value] || 0) + 1;
            }
            return acc;
        }, {});
        Object.keys(counts).forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = `${value} (${counts[value]})`;
            select.appendChild(option);
        });
    };

    populateSelect(document.getElementById('type'), data.map(property => property.type));
    populateSelect(document.getElementById('state'), data.map(property => property.state));
    populateSelect(document.getElementById('city'), data.map(property => property.city));
    populateSelect(document.getElementById('neighborhood'), data.map(property => property.neighborhood));
    populateSelect(document.getElementById('bedrooms'), data.map(property => property.bedrooms));
    populateSelect(document.getElementById('garages'), data.map(property => property.garages));
    populateSelect(document.getElementById('bathrooms'), data.map(property => property.bathrooms));
    populateSelect(document.getElementById('category'), data.map(property => property.category));

    const prices = data.map(property => property.minimumBid);
    const totalPrices = prices.reduce((total, price) => total + price, 0);
    const averagePrice = totalPrices / prices.length;
    const priceRanges = [
        Math.floor(averagePrice * 0.5),
        Math.floor(averagePrice * 0.75),
        Math.floor(averagePrice),
        Math.floor(averagePrice * 1.25),
        Math.floor(averagePrice * 1.5)
    ];

    priceRanges.forEach(price => {
        const option = document.createElement('option');
        option.value = price;
        option.textContent = `R$ ${price.toLocaleString('pt-BR')}`;
        document.getElementById('price').appendChild(option);
    });
}

async function fetchAllJsonFiles(files) {
    const allData = [];
    for (const file of files) {
        const response = await fetch(file);
        const data = await response.json();
        allData.push(...data);
    }
    return allData;
}