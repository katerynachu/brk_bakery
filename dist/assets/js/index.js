
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