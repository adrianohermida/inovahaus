function renderProperties(properties, currentPage = 1, propertiesPerPage = 10) {
    const resultsContainer = document.getElementById('property-grid-results');
    const paginationWrapper = document.querySelector('.pagination-wrapper');
    resultsContainer.innerHTML = '';
    paginationWrapper.innerHTML = '';

    const totalPages = Math.ceil(properties.length / propertiesPerPage);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentProperties = properties.slice(startIndex, endIndex);

    currentProperties.forEach(property => {
        const propertyCard = `
            <div class="col-md-4">
                <div class="card-box-a card-shadow">
                    <div class="img-box-a">
                        <img src="${property.images[0] || 'assets/img/property/600x800.png'}" alt="${property.title}" class="img-a img-fluid">
                        <div class="ribbon">${property.category}</div>
                    </div>
                    <div class="card-overlay">
                        <div class="card-overlay-a-content">
                            <div class="card-header-a">
                                <h2 class="card-title-a">
                                    <a href="property-single.html?id=${property.id}">${property.title}
                                        <br /> ${property.city}, ${property.state}</a>
                                </h2>
                            </div>
                            <div class="card-body-a">
                                <div class="price-box d-flex">
                                    <span class="price-a">Lance mínimo | R$ ${property.minimumBid.toLocaleString('pt-BR')}</span>
                                </div>
                                <a href="property-single.html?id=${property.id}" class="link-a">Clique aqui para ver
                                    <span class="bi bi-chevron-right"></span>
                                </a>
                            </div>
                            <div class="card-footer-a">
                                <ul class="card-info d-flex justify-content-around">
                                    <li>
                                        <h4 class="card-info-title">Área</h4>
                                        <span>${property.area || 'N/A'} m²</span>
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
                                        <h4 class="card-info-title">Garagens</h4>
                                        <span>${property.garages || 'N/A'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.insertAdjacentHTML("beforeend", propertyCard);
    });

    renderPagination(currentPage, totalPages);
}

function renderPagination(currentPage, totalPages) {
    const paginationWrapper = document.querySelector('.pagination-wrapper');
    let paginationHtml = '';

    if (currentPage > 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a></li>`;
    }

    if (currentPage > 2) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
        if (currentPage > 3) {
            paginationHtml += `<li class="page-item"><span class="page-link">...</span></li>`;
        }
    }

    if (currentPage > 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage - 1})">${currentPage - 1}</a></li>`;
    }

    paginationHtml += `<li class="page-item active"><span class="page-link">${currentPage}</span></li>`;

    if (currentPage < totalPages) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage + 1})">${currentPage + 1}</a></li>`;
    }

    if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
            paginationHtml += `<li class="page-item"><span class="page-link">...</span></li>`;
        }
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
    }

    if (currentPage < totalPages) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a></li>`;
    }

    paginationWrapper.innerHTML = paginationHtml;
}

function changePage(page) {
    renderProperties(allProperties, page);
}
