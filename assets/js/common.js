// assets/js/common.js

async function fetchAllJsonFiles(files) {
    const allProperties = [];
    const dataArrays = await Promise.all(files.map(file => fetch(file).then(response => response.json())));
    dataArrays.forEach(data => allProperties.push(...data));
    allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    localStorage.setItem('allProperties', JSON.stringify(allProperties));
    return allProperties;
}

function getStoredProperties() {
    return JSON.parse(localStorage.getItem('allProperties')) || [];
}
