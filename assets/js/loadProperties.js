// assets/js/loadProperties.js

import { renderProperties, renderPagination, getFilters } from './renderProperties.js';

let currentPage = 1;
const itemsPerPage = 6;
let allProperties = [];

document.addEventListener('DOMContentLoaded', async function () {
    allProperties = await fetchProperties();
    localStorage.setItem('allProperties', JSON.stringify(allProperties));
    setupSearch();
    populateFilters(allProperties);
    renderProperties(allProperties, currentPage, itemsPerPage);
});

async function fetchProperties() {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];

    const fetchAllJsonFiles = (files) => {
        return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };

    const dataArrays = await fetchAllJsonFiles(jsonFiles);
    let properties = [];
    dataArrays.forEach(data => properties = properties.concat(data));
    return properties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
}

function setupSearch() {
    const searchForm = document.querySelector('#property-search-form');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const filters = getFilters();
        localStorage.setItem('propertyFilters', JSON.stringify(filters));
        renderProperties(allProperties, 1, itemsPerPage, filters);
    });
}

function populateFilters(data) {
    const populateSelect = (selectId, values) => {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '<option value="">Todos</option>';
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
            selectElement.appendChild(option);
        });
    };

    populateSelect('type', data.map(property => property.type));
    populateSelect('state', data.map(property => property.state));
    populateSelect('city', data.map(property => property.city));
    populateSelect('neighborhood', data.map(property => property.neighborhood));
    populateSelect('bedrooms', data.map(property => property.bedrooms));
    populateSelect('garages', data.map(property => property.garages));
    populateSelect('bathrooms', data.map(property => property.bathrooms));
    populateSelect('category', data.map(property => property.category));
}

export { fetchProperties, setupSearch, populateFilters };
