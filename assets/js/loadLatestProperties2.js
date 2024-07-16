// /assets/js/loadLatestProperties.js

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

    const renderLatestProperties = (properties) => {
        const propertyCarousel = document.querySelector('.swiper-wrapper');
        propertyCarousel.innerHTML = ''; // Clear previous content

        properties.forEach(property => {
            const propertyItem = `
                <div class="carousel-item-b swiper-slide">
                    <div class="card-box-a card-shadow">
                        <div class="img-box-a">
                            <img src="${property.image || 'placeholder.jpg'}" alt="${property.title || ''}" class="img-a img-fluid">
                            <div class="ribbon">${property.state || ''}</div>
                        </div>
                        <div class="card-overlay">
                            <div class="card-overlay-a-content">
                                <div class="card-header-a">
                                    <h2 class="card-title-a">
                                        <a href="property-single.html?id=${property.id}">${property.title || ''}
                                            <br /> ${property.neighborhood || ''}, ${property.city || ''}, ${property.state || ''}</a>
                                    </h2>
                                </div>
                                <div class="card-body-a">
                                    <div class="price-box d-flex justify-content-between">
                                        <span class="price-a">Avaliação | R$ ${property.marketValue ? property.marketValue.toLocaleString('pt-BR') : 'N/A'}</span>
                                    </div>
                                    <a href="property-single.html?id=${property.id}" class="link-a">Saiba mais
                                        <span class="bi bi-chevron-right"></span>
                                    </a>
                                </div>
                                <div class="card-footer-a">
                                    <ul class="card-info d-flex justify-content-around">
                                        <li>
                                            <h4 class="card-info-title">Área</h4>
                                            <span>${property.area ? property.area + ' m²' : 'N/A'}</span>
                                        </li>
                                        <li>
                                            <h4 class="card-info-title">Quartos</h4>
                                            <span>${property.bedrooms || 'N/A'}</span>
                                        </li>
                                        <li>
                                            <h4 class="card-info-title">Banheiros</h4>
                                            <span>${property.bathrooms || 'N/A'}</span>
                                        </li>
                                        <li>
                                            <h4 class="card-info-title">Garagem</h4>
                                            <span>${property.garages || 'N/A'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            propertyCarousel.insertAdjacentHTML('beforeend', propertyItem);
        });

        // Initialize Swiper after content is added
        new Swiper('.swiper', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    };

    fetchAllJsonFiles(jsonFiles)
        .then(dataArrays => {
            dataArrays.forEach(data => allProperties = allProperties.concat(data));
            allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            renderLatestProperties(allProperties.slice(0, 10)); // Display the latest 10 properties
        })
        .catch(error => console.error('Error loading JSON files:', error));
});
