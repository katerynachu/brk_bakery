// BURGER_MENU
let burgerMenu = document.getElementById('burger-menu');

let overlay = document.getElementById('mobile-menu');

burgerMenu.addEventListener('click', function () {
    this.classList.toggle("close");
    overlay.classList.toggle("overlay");
});