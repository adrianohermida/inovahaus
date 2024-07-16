document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/js/property.json")
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const propertyCarousel = document.querySelector(".intro .swiper-wrapper");
  
        const auctionProperties = data.filter(property => {
          const nextAuctionDate = new Date(property.nextAuction);
          return property.category === 'Leilão' && nextAuctionDate >= today;
        });
  
        auctionProperties.forEach((property) => {
          const isLeilaoFinalizado = new Date(property.nextAuction) <= today;
          const ribbonText = isLeilaoFinalizado ? 'Finalizado' : 'Leilão';
  
          const propertyItem = `
            <div class="swiper-slide carousel-item-a intro-item bg-image" style="background-image: url(${property.image});">
              <div class="overlay overlay-a"></div>
              <div class="intro-content display-table">
                <div class="table-cell">
                  <div class="container">
                    <div class="row">
                      <div class="col-lg-8">
                        <div class="intro-body">
                          <h1 class="intro-title mb-4">
                            <a href="property-single.html?id=${property.id}">${property.title}
                              <br /> ${property.city}, ${property.state}</a>
                          </h1>
                          <div class="intro-subtitle intro-price">
                            <p class="price-a">Lance mínimo | R$ ${property.minimumBid.toLocaleString('pt-BR')}</p>
                          </div>
                          <a href="property-single.html?id=${property.id}" class="btn btn-a">Clique aqui para ver
                            <span class="bi bi-chevron-right"></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ribbon">${ribbonText}</div>
            </div>
          `;
          propertyCarousel.insertAdjacentHTML("beforeend", propertyItem);
        });
  
        new Swiper(".intro-carousel", {
          speed: 600,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          slidesPerView: 1,
          pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,
          },
        });
      })
      .catch((error) => console.error("Error fetching properties:", error));
  });
  