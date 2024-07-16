// assets/js/loadProperties.js
// Load and combine JSON data from multiple files for property listing

async function fetchProperties(files) {
    const requests = files.map(file => fetch(file).then(response => response.json()));
    const properties = await Promise.all(requests);
    return properties.flat();
}

const propertyFiles = [
    'assets/js/property_1_to_50.json',
    'assets/js/property_51_to_100.json',
    'assets/js/property_101_to_150.json',
    'assets/js/property_151_to_152.json'
];

document.addEventListener('DOMContentLoaded', async function() {
    const properties = await fetchProperties(propertyFiles);
    localStorage.setItem('allProperties', JSON.stringify(properties));
});