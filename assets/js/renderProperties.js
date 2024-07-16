
const renderProperties = (page, filters = {}) => {
    const filteredProperties = allProperties.filter(property => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            if (key === 'keyword') {
                return Object.values(property).some(value =>
                    value && value.toString().toLowerCase().includes(filters[key].toLowerCase())
                );
            }
            if (property[key] == null) return false;
            return property[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
        });
    });

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);

    const propertyGrid = document.getElementById('property-grid-results');
    propertyGrid.innerHTML = '';

    propertiesToShow.forEach(property => {
        const propertyCard = `
            <div class="col-md-4">
                <div class="card-box-a card-shadow">
                    <div class="img-box-a">
                        <img src="${property.images[0] || 'assets/img/placeholder.jpg'}" alt="${property.title || ''}" class="img-a img-fluid">
                    </div>
                    <div class="card-overlay">
                        <div class="card-overlay-a-content">
                            <div class="card-header-a">
                                <h2 class="card-title-a">
                                    <a href="property-single.html?id=${property.id}">${property.title || ''}
                                        <br /> ${property.city || ''}, ${property.state || ''}</a>
                                </h2>
                            </div>
                            <div class="card-body-a">
                                <div class="price-box d-flex justify-content-between">
                                    <div>
                                        <span class="price-title">Lance mínimo</span>
                                        <span class="price-a">R$ ${property.minimumBid ? property.minimumBid.toLocaleString('pt-BR') : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span class="price-title">Avaliação Mercado</span>
                                        <span class="price-a">R$ ${property.marketValue ? property.marketValue.toLocaleString('pt-BR') : 'N/A'}</span>
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
                                        <span>${property.area ? property.area + ' m²' : 'N/A'}</span>
                                    </li>
                                    <li>
                                        <h4 class="card-info-title">Quartos</h4>
                                        <span>${property.bedrooms || 'N/A'}</span>
                                    </li>
                                    <li>
                                        <h4 class="card-info-title">Banheiros</h4>
                                        <span>${property.bathrooms || 'N/A'}</span>
                                    </li>
                                    <li>
                                        <h4 class="card-info-title">Garagem</h4>
                                        <span>${property.garages || 'N/A'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        propertyGrid.insertAdjacentHTML('beforeend', propertyCard);
    });

    renderPagination(filteredProperties.length, page);
};

const renderPagination = (totalItems, currentPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationWrapper = document.querySelector('.pagination-wrapper');
    paginationWrapper.innerHTML = '';

    const createPageItem = (page, isActive = false) => {
        return `
            <li class="page-item ${isActive ? 'active' : ''}">
                <a class="page-link" href="#">${page}</a>
            </li>
        `;
    };

    paginationWrapper.insertAdjacentHTML('beforeend', `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}"><span class="bi bi-chevron-left"></span></a>
        </li>
    `);

    if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) {
            paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(i, i === currentPage));
        }
    } else {
        paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(1, currentPage === 1));
        if (currentPage > 2) {
            paginationWrapper.insertAdjacentHTML('beforeend', `<li class="page-item disabled"><a class="page-link">...</a></li>`);
        }
        if (currentPage > 1 && currentPage < totalPages) {
            paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(currentPage, true));
        }
        if (currentPage < totalPages - 1) {
            paginationWrapper.insertAdjacentHTML('beforeend', `<li class="page-item disabled"><a class="page-link">...</a></li>`);
        }
        paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(totalPages, currentPage === totalPages));
    }

    paginationWrapper.insertAdjacentHTML('beforeend', `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}"><span class="bi bi-chevron-right"></span></a>
        </li>
    `);

    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = parseInt(event.target.dataset.page);
            if (page && !isNaN(page)) {
                renderProperties(page, currentFilters);
            }
        });
    });
};

// Initial call to render properties
document.addEventListener('DOMContentLoaded', () => {
    renderProperties(1);
});
