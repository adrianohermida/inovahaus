document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/js/property.json")
      .then((response) => response.json())
      .then((data) => {
        const propertyCarousel = document.querySelector("#property-carousel .swiper-wrapper");
  
        const recentProperties = data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 6);
  
        recentProperties.forEach((property) => {
          const propertyItem = `
            <div class="swiper-slide carousel-item-b">
              <div class="card-box-a card-shadow">
                <div class="img-box-a">
                  <img src="${property.image}" alt="${property.title}" class="img-a img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-overlay-a-content">
                    <div class="card-header-a">
                      <h2 class="card-title-a">
                        <a href="property-single.html?id=${property.id}">${property.title}
                          <br /> ${property.city}, ${property.state}</a>
                      </h2>
                    </div>
                    <div class="card-body-a">
                      <div class="price-box d-flex justify-content-between">
                        <div>
                          <span class="price-title white-text">Lance mínimo</span>
                          <span class="price-a">R$ ${property.minimumBid.toLocaleString('pt-BR')}</span>
                        </div>
                        <div>
                          <span class="price-title white-text">Avaliação Mercado</span>
                          <span class="price-a">R$ ${property.marketValue ? property.marketValue.toLocaleString('pt-BR') : 'N/A'}</span>
                        </div>
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
          propertyCarousel.insertAdjacentHTML("beforeend", propertyItem);
        });
  
        new Swiper("#property-carousel", {
          speed: 600,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          slidesPerView: 3,
          pagination: {
            el: ".propery-carousel-pagination",
            type: "bullets",
            clickable: true,
          },
          breakpoints: {
            768: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          },
        });
      })
      .catch((error) => console.error("Error fetching properties:", error));
  });
  