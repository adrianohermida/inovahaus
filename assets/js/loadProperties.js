document.addEventListener("DOMContentLoaded", function() {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];

    let allProperties = [];
    const itemsPerPage = 6;
    let currentPage = 1;

    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    const populateCategories = (data) => {
        const categorySelect = document.getElementById('filter-category');
        const categories = [...new Set(data.map(property => property.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    };

    const renderProperties = (page, filters = {}) => {
        const filteredProperties = allProperties.filter(property => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                if (key === 'keyword') {
                    return Object.values(property).some(value => value.toString().toLowerCase().includes(filters[key].toLowerCase()));
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
                <div class="col-md-4 mb-4">
                    <div class="card-box-a card-shadow">
                        <div class="img-box-a">
                            <img src="${property.images && property.images.length > 0 ? property.images[0] : 'assets/img/property/600x800.png'}" alt="${property.title}" class="img-a img-fluid">
                            <div class="ribbon">${property.status}</div>
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
                                    <div class="price-box d-flex justify-content-between">
                                        <div>
                                            <span class="price-title white-text">Lance mínimo</span>
                                            <span class="price-a">R$ ${property.minimumBid ? property.minimumBid.toLocaleString('pt-BR') : 'Não há resultado'}</span>
                                        </div>
                                        <div>
                                            <span class="price-title white-text">Avaliação Mercado</span>
                                            <span class="price-a">R$ ${property.marketValue ? property.marketValue.toLocaleString('pt-BR') : 'Não há resultado'}</span>
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
                                            <span>${property.area ? property.area + 'm²' : 'Não há resultado'}</span>
                                        </li>
                                        <li>
                                            <h4 class="card-info-title">Quartos</h4>
                                            <span>${property.bedrooms || 'Não há resultado'}</span>
                                        </li>
                                        <li>
                                            <h4 class="card-info-title">Banheiros</h4>
                                            <span>${property.bathrooms || 'Não há resultado'}</span>
                                        </li>
                                        <li>
                                            <h4 class="card-info-title">Garagem</h4>
                                            <span>${property.garages || 'Não há resultado'}</span>
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

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                const pageItem = `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#">${i}</a>
                    </li>
                `;
                paginationWrapper.insertAdjacentHTML('beforeend', pageItem);
            } else if (i === 2 || i === totalPages - 1) {
                paginationWrapper.insertAdjacentHTML('beforeend', `<li class="page-item"><span class="page-link">...</span></li>`);
            }
        }

        document.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const pageNumber = parseInt(event.target.textContent);
                if (!isNaN(pageNumber)) {
                    currentPage = pageNumber;
                    const filters = getFilters();
                    renderProperties(currentPage, filters);
                }
            });
        });
    };

    const getFilters = () => {
        const keyword = document.getElementById('keyword').value;
        const type = document.getElementById('type').value;
        const state = document.getElementById('state').value;
        const city = document.getElementById('city').value;
        const neighborhood = document.getElementById('neighborhood').value;
        const bedrooms = document.getElementById('bedrooms').value;
        const garages = document.getElementById('garages').value;
        const bathrooms = document.getElementById('bathrooms').value;
        const price = document.getElementById('price').value ? parseFloat(document.getElementById('price').value.replace('R$', '').replace(/\./g, '').replace(',', '.')) : null;
        const category = document.getElementById('filter-category').value;

        return { keyword, type, state, city, neighborhood, bedrooms, garages, bathrooms, price, category };
    };

    document.getElementById('property-search-form').addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 1;
        const filters = getFilters();
        renderProperties(currentPage, filters);
    });

    document.getElementById('filter-category').addEventListener('change', (event) => {
        currentPage = 1;
        const filters = getFilters();
        renderProperties(currentPage, filters);
    });

    fetchAllJsonFiles(jsonFiles)
        .then(dataArrays => {
            allProperties = dataArrays.flat();
            allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            populateCategories(allProperties);
            renderProperties(1);
        })
        .catch(error => console.error('Erro ao carregar os arquivos JSON:', error));
});
