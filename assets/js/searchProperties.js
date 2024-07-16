// assets/js/searchProperties.js
document.addEventListener("DOMContentLoaded", function() {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];
    let allProperties = [];

    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    const fillOptions = (selectId, options) => {
        const selectElement = document.getElementById(selectId);
        if (selectElement) {
            const uniqueOptions = [...new Set(options)].filter(option => option !== undefined && option !== null);
            uniqueOptions.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option;
                optElement.textContent = option;
                selectElement.appendChild(optElement);
            });
        }
    };

    fetchAllJsonFiles(jsonFiles)
        .then(dataArrays => {
            dataArrays.forEach(data => allProperties = allProperties.concat(data));
            allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

            const types = allProperties.map(property => property.type);
            const states = allProperties.map(property => property.state);
            const cities = allProperties.map(property => property.city);
            const neighborhoods = allProperties.map(property => property.neighborhood);
            const bedrooms = allProperties.map(property => property.bedrooms);
            const garages = allProperties.map(property => property.garages);
            const bathrooms = allProperties.map(property => property.bathrooms);
            const prices = allProperties.map(property => property.minimumBid);
            const categories = allProperties.map(property => property.category);

            fillOptions('type', types);
            fillOptions('state', states);
            fillOptions('city', cities);
            fillOptions('neighborhood', neighborhoods);
            fillOptions('bedrooms', bedrooms);
            fillOptions('garages', garages);
            fillOptions('bathrooms', bathrooms);
            fillOptions('price', prices.map(price => `R$ ${price.toLocaleString('pt-BR')}`));
            fillOptions('category', categories);

            const searchForm = document.getElementById('property-search-form');
            if (searchForm) {
                searchForm.addEventListener('submit', function(event) {
                    event.preventDefault();

                    const filters = {
                        keyword: document.getElementById('keyword').value.toLowerCase(),
                        type: document.getElementById('type').value,
                        state: document.getElementById('state').value,
                        city: document.getElementById('city').value,
                        neighborhood: document.getElementById('neighborhood').value,
                        bedrooms: document.getElementById('bedrooms').value,
                        garages: document.getElementById('garages').value,
                        bathrooms: document.getElementById('bathrooms').value,
                        price: parseFloat(document.getElementById('price').value.replace('R$', '').replace('.', '').replace(',', '')) || null,
                        category: document.getElementById('category').value
                    };

                    localStorage.setItem('propertyFilters', JSON.stringify(filters));
                    window.location.href = 'property-grid.html';
                });
            }
        })
        .catch(error => console.error('Erro ao carregar os arquivos JSON:', error));
});
