// assets/js/filters.js
// Handle filters for property search

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

export { getFilters, populateFilters };
