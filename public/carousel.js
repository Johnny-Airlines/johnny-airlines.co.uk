// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1.5, // Show 1 full slide and parts of the next/prev
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  loop: true, // Enable looping
});
