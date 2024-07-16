// renderProperties.js

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

function renderProperties(properties, page, itemsPerPage, filters = {}) {
    const filteredProperties = properties.filter(property => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            if (key === 'keyword') {
                return Object.values(property).some(value => 
                    value.toString().toLowerCase().includes(filters[key].toLowerCase())
                );
            }
            if (property[key] == null) return false;
            return property[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
        });
    });

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

    const propertyGrid = document.querySelector('#property-grid-results');
    propertyGrid.innerHTML = '';

    propertiesToShow.forEach(property => {
        const isLeilaoFinalizado = new Date(property.nextAuction) <= new Date();
        const ribbonText = isLeilaoFinalizado ? 'Finalizado' : property.state;
        const propertyElement = createPropertyGridElement(property, ribbonText);
        propertyGrid.appendChild(propertyElement);
    });

    renderPagination(filteredProperties.length, itemsPerPage);
}

function renderPagination(totalItems, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationWrapper = document.querySelector('.pagination-wrapper');
    paginationWrapper.innerHTML = '';

    const createPageItem = (page, label, isActive = false) => {
        return `
            <li class="page-item ${isActive ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${page}">${label}</a>
            </li>
        `;
    };

    if (totalPages <= 1) return;

    paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(1, 1, currentPage === 1));
    if (currentPage > 3) {
        paginationWrapper.insertAdjacentHTML('beforeend', '<li class="page-item"><span class="page-link">...</span></li>');
    }
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(i, i, currentPage === i));
    }
    if (currentPage < totalPages - 2) {
        paginationWrapper.insertAdjacentHTML('beforeend', '<li class="page-item"><span class="page-link">...</span></li>');
    }
    paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(totalPages, totalPages, currentPage === totalPages));

    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = parseInt(event.target.dataset.page);
            const filters = getFilters();
            renderProperties(properties, currentPage, itemsPerPage, filters);
        });
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

export { renderProperties, renderPagination, getFilters };
