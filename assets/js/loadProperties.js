document.addEventListener("DOMContentLoaded", function () {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];
    let allProperties = [];
    let categories = new Set();

    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    fetchAllJsonFiles(jsonFiles)
        .then(dataArrays => {
            dataArrays.forEach(data => {
                allProperties = allProperties.concat(data);
                data.forEach(property => {
                    if (property.category) categories.add(property.category);
                });
            });
            allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

            renderCategories(categories);
            renderProperties(allProperties);
            setupPagination(allProperties);
        })
        .catch(error => console.error('Erro ao carregar os arquivos JSON:', error));
});

function renderCategories(categories) {
    const categorySelect = document.getElementById('filter-category');
    if (categorySelect) {
        categories.forEach(category => {
            const optElement = document.createElement('option');
            optElement.value = category;
            optElement.textContent = category;
            categorySelect.appendChild(optElement);
        });
    }
}
