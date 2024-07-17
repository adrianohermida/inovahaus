// loadProperties.js

document.addEventListener("DOMContentLoaded", function () {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];
    let allProperties = [];
    let currentPage = 1;
    const propertiesPerPage = 6;

    // Function to fetch all JSON files
    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    // Function to get unique categories
    const getUniqueCategories = (properties) => {
        const categories = properties.map(property => property.category).filter(category => category !== undefined);
        return [...new Set(categories)];
    };

    // Function to fill categories in the dropdown
    const fillCategoryDropdown = (categories) => {
        const categorySelect = document.getElementById('filter-category');
        categorySelect.innerHTML = '<option value="">Todas as Categorias</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    };

    // Function to display properties
    const displayProperties = (properties, page = 1) => {
        const startIndex = (page - 1) * propertiesPerPage;
        const endIndex = startIndex + propertiesPerPage;
        const paginatedProperties = properties.slice(startIndex, endIndex);

        const resultsContainer = document.getElementById('property-grid-results');
        resultsContainer.innerHTML = '';

        paginatedProperties.forEach(property => {
            const propertyCard = `
                <div class="col-md-4">
                    <div class="card-box-a card-shadow">
                        <div class="img-box-a">
                            <img src="${property.images && property.images.length > 0 ? property.images[0] : 'assets/img/property/600x800.png'}" alt="" class="img-a img-fluid">
                            ${property.category ? `<div class="ribbon">${property.category}</div>` : ''}
                        </div>
                        <div class="card-overlay">
                            <div class="card-overlay-a-content">
                                <div class="card-header-a">
                                    <h2 class="card-title-a">
                                        <a href="property-single.html?id=${property.id}">${property.title}</a>
                                    </h2>
                                </div>
                                <div class="card-body-a">
                                    <div class="price-box d-flex justify-content-center">
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
                                            <span>${property.area || 'N/A'}</span>
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
            resultsContainer.insertAdjacentHTML('beforeend', propertyCard);
        });

        setupPagination(properties.length, page);
    };

    // Function to set up pagination
    const setupPagination = (totalProperties, currentPage) => {
        const totalPages = Math.ceil(totalProperties / propertiesPerPage);
        const paginationWrapper = document.querySelector('.pagination-wrapper');
        paginationWrapper.innerHTML = '';

        const createPageLink = (page, text, active = false) => {
            return `<li class="page-item ${active ? 'active' : ''}"><a class="page-link" href="#" data-page="${page}">${text}</a></li>`;
        };

        if (currentPage > 1) {
            paginationWrapper.innerHTML += createPageLink(currentPage - 1, '&laquo;');
        }

        paginationWrapper.innerHTML += createPageLink(1, '1', currentPage === 1);
        if (currentPage > 3) {
            paginationWrapper.innerHTML += `<li class="page-item"><span class="page-link">...</span></li>`;
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            paginationWrapper.innerHTML += createPageLink(i, i, currentPage === i);
        }

        if (currentPage < totalPages - 2) {
            paginationWrapper.innerHTML += `<li class="page-item"><span class="page-link">...</span></li>`;
        }

        paginationWrapper.innerHTML += createPageLink(totalPages, totalPages, currentPage === totalPages);

        if (currentPage < totalPages) {
            paginationWrapper.innerHTML += createPageLink(currentPage + 1, '&raquo;');
        }

        const pageLinks = document.querySelectorAll('.page-link');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.getAttribute('data-page'));
                displayProperties(allProperties, page);
            });
        });
    };

    // Fetch and process properties
    fetchAllJsonFiles(jsonFiles).then(dataArrays => {
        dataArrays.forEach(data => allProperties = allProperties.concat(data));
        const uniqueCategories = getUniqueCategories(allProperties);
        fillCategoryDropdown(uniqueCategories);
        displayProperties(allProperties, currentPage);

        // Filter properties by category
        document.getElementById('filter-category').addEventListener('change', (e) => {
            const category = e.target.value;
            const filteredProperties = category ? allProperties.filter(property => property.category === category) : allProperties;
            displayProperties(filteredProperties, currentPage);
        });

        // Search properties
        document.getElementById('property-search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = document.getElementById('keyword').value.toLowerCase();
            const filteredProperties = allProperties.filter(property => {
                return Object.values(property).some(value => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        return value.toString().toLowerCase().includes(keyword);
                    }
                    return false;
                });
            });
            displayProperties(filteredProperties, currentPage);
        });
    }).catch(error => console.error('Erro ao carregar os arquivos JSON:', error));
});
