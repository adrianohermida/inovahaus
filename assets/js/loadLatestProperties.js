// assets/js/loadLatestProperties.js

document.addEventListener("DOMContentLoaded", async function() {
    const jsonFiles = [
        'assets/js/property_1_to_50.json',
        'assets/js/property_51_to_100.json',
        'assets/js/property_101_to_150.json',
        'assets/js/property_151_to_152.json'
    ];
    let allProperties = await fetchAllJsonFiles(jsonFiles);
    displayLatestProperties(allProperties);
});

async function fetchAllJsonFiles(files) {
    const allData = [];
    for (const file of files) {
        const response = await fetch(file);
        const data = await response.json();
        allData.push(...data);
    }
    allData.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    return allData;
}

function displayLatestProperties(properties) {
    const latestPropertiesSection = document.querySelector('#property-carousel .swiper-wrapper');
    latestPropertiesSection.innerHTML = '';

    properties.slice(0, 6).forEach(property => {
        const propertyCard = `
            <div class="swiper-slide">
                <div class="card-box-a card-shadow">
                    <div class="img-box-a">
                        <img src="${property.image || 'placeholder.jpg'}" alt="${property.title || ''}" class="img-a img-fluid">
                    </div>
                    <div class="card-overlay">
                        <div class="card-overlay-a-content">
                            <div class="card-header-a">
                                <h2 class="card-title-a">
                                    <a href="#">${property.title || ''}</a>
                                </h2>
                            </div>
                            <div class="card-body-a">
                                <div class="price-box d-flex">
                                    <span class="price-a">Lance mínimo | R$ ${property.minimumBid ? property.minimumBid.toLocaleString('pt-BR') : 'N/A'}</span>
                                </div>
                                <a href="property-single.html" class="link-a">Clique aqui para ver
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
                                        <h4 class="card-info-title">Garagens</h4>
                                        <span>${property.garages || 'N/A'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        latestPropertiesSection.insertAdjacentHTML('beforeend', propertyCard);
    });

    new Swiper('#property-carousel', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: {
            el: '.property-carousel-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        },
    });
}