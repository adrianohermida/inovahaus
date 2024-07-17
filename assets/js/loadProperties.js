// loadProperties.js
document.addEventListener("DOMContentLoaded", async function () {
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
  
    const fetchAllJsonFiles = async (files) => {
      return Promise.all(files.map(file => fetch(file).then(response => response.json())));
    };
  
    const populateCategories = (properties) => {
      const categories = [...new Set(properties.map(property => property.category))];
      const categorySelect = document.getElementById('filter-category');
      if (categorySelect) {
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
        });
      }
    };
  
    const initialize = async () => {
      try {
        const dataArrays = await fetchAllJsonFiles(jsonFiles);
        dataArrays.forEach(data => allProperties = allProperties.concat(data));
        allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  
        populateCategories(allProperties);
        renderProperties(currentPage, filters);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
  
    initialize();
  });
  