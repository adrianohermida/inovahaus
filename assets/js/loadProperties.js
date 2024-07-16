document.addEventListener("DOMContentLoaded", function() {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];

    let allProperties = [];
    let categories = new Set();
    const itemsPerPage = 6;
    let currentPage = 1;

    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    const renderProperties = (page, filters = {}) => {
        const filteredProperties = allProperties.filter(property => {
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

        const propertyGrid = document.querySelector('#property-grid-results');
        propertyGrid.innerHTML = '';

        propertiesToShow.forEach(property => {
            const propertyItem = `
                <div class="col-md-4">
                  <div class="card-box-a card-shadow">
                    <div class="img-box-a">
                      <img src="${property.images && property.images.length > 0 ? property.images[0] : 'assets/img/property/600x800.png'}" alt="${property.title}" class="img-a img-fluid">
                    </div>
                    <div class="card-overlay">
                      <div class="card-overlay-a-content">
                        <div class="card-header-a">
                          <h2 class="card-title-a">
                            <a href="#">${property.title}</a>
                          </h2>
                        </div>
                        <div class="card-body-a">
                          <div class="price-box d-flex">
                            <span class="price-a">Lance mínimo | R$ ${property.minimumBid.toLocaleString('pt-BR')}</span>
                          </div>
                          <div class="price-box d-flex">
                            <span class="price-a">Avaliação de Mercado | R$ ${property.marketValue ? property.marketValue.toLocaleString('pt-BR') : 'N/A'}</span>
                          </div>
                          <a href="property-single.html?id=${property.id}" class="link-a">Clique aqui para ver
                            <span class="bi bi-chevron-right"></span>
                          </a>
                        </div>
                        <div class="card-footer-a">
                          <ul class="card-info d-flex justify-content-around">
                            <li>
                              <h4 class="card-info-title">Área</h4>
                              <span>${property.area} m²</span>
                            </li>
                            <li>
                              <h4 class="card-info-title">Quartos</h4>
                              <span>${property.bedrooms}</span>
                            </li>
                            <li>
                              <h4 class="card-info-title">Banheiros</h4>
                              <span>${property.bathrooms}</span>
                            </li>
                            <li>
                              <h4 class="card-info-title">Garagens</h4>
                              <span>${property.garages}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `;
            propertyGrid.insertAdjacentHTML('beforeend', propertyItem);
        });

        renderPagination(filteredProperties.length);
    };

    const renderPagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationWrapper = document.querySelector('.pagination-wrapper');
        paginationWrapper.innerHTML = '';

        const createPageItem = (page, label = null) => {
            const isActive = page === currentPage;
            const itemClass = isActive ? 'page-item active' : 'page-item';
            const labelText = label || page;
            return `<li class="${itemClass}"><a class="page-link" href="#" data-page="${page}">${labelText}</a></li>`;
        };

        if (currentPage > 1) {
            paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(currentPage - 1, '<span class="bi bi-chevron-left"></span>'));
        }

        if (currentPage > 2) {
            paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(1));
            if (currentPage > 3) {
                paginationWrapper.insertAdjacentHTML('beforeend', `<li class="page-item"><span class="page-link">...</span></li>`);
            }
        }

        paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(currentPage));

        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) {
                paginationWrapper.insertAdjacentHTML('beforeend', `<li class="page-item"><span class="page-link">...</span></li>`);
            }
            paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(totalPages));
        }

        if (currentPage < totalPages) {
            paginationWrapper.insertAdjacentHTML('beforeend', createPageItem(currentPage + 1, '<span class="bi bi-chevron-right"></span>'));
        }

        document.querySelectorAll('.pagination a.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(link.getAttribute('data-page'));
                renderProperties(currentPage);
            });
        });
    };

    const populateCategoryFilter = () => {
        const categorySelect = document.getElementById('filter-category');
        categorySelect.innerHTML = '<option value="">Todos</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value;
            const filters = { category: selectedCategory };
            renderProperties(1, filters);
        });
    };

    fetchAllJsonFiles(jsonFiles)
        .then(dataArrays => {
            dataArrays.forEach(data => {
                allProperties = allProperties.concat(data);
                data.forEach(property => {
                    if (property.category) {
                        categories.add(property.category);
                    }
                });
            });
            populateCategoryFilter();
            renderProperties(currentPage);
        })
        .catch(error => console.error('Erro ao carregar os arquivos JSON:', error));
});
