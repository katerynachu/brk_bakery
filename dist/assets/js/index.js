
// BURGER_MENU
let burgerMenu = document.getElementById('burger-menu');
let menuList = document.getElementById('mobile-menu');

burgerMenu.addEventListener('click', function () {
    this.classList.toggle("close");
    if (this.classList.contains("close")) {
        menuList.classList.remove("is-hidden");
    } else {
        menuList.classList.add("is-hidden");
    }
});
addEventListener('DOMContentLoaded', (event) => {

  $('.about-us-slider').slick({
      dots: false,
      infinite: true,
      vertical: true,
      // autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      // autoplaySpeed: 1000,
      pauseOnFocus: false,
      pauseOnHover: false,
      easing: 'ease',
      waitForAnimate: false
  
  });

 
  
  
  });
"use strict";