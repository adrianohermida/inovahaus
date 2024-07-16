// loadProperties.js
document.addEventListener("DOMContentLoaded", function () {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];

    let allProperties = [];
    const itemsPerPage = 6;
    let currentPage = 1;
    let filters = {};

    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    const updateCategoryOptions = () => {
        const categorySelect = document.getElementById('filter-category');
        const categories = [...new Set(allProperties.map(property => property.category))].filter(category => category);
        categorySelect.innerHTML = '<option value="">Todos</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    };

    document.getElementById('property-search-form').addEventListener('submit', (event) => {
        event.preventDefault();
        filters = {
            keyword: document.getElementById('keyword').value.toLowerCase(),
            type: document.getElementById('type').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value,
            neighborhood: document.getElementById('neighborhood').value,
            bedrooms: document.getElementById('bedrooms').value,
            garages: document.getElementById('garages').value,
            bathrooms: document.getElementById('bathrooms').value,
            price: parseFloat(document.getElementById('price').value.replace('R$', '').replace(/\./g, '').replace(',', '.')),
            category: document.getElementById('category').value
        };
        renderProperties(1, filters);
    });

    fetchAllJsonFiles(jsonFiles)
        .then(dataArrays => {
            allProperties = dataArrays.flat();
            allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            updateCategoryOptions();
            renderProperties(currentPage);
        })
        .catch(error => console.error('Erro ao carregar os arquivos JSON:', error));
});
