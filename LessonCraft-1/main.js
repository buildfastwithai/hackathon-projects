// changing navbar on scroll

window.addEventListener('scroll', () => {
    document.querySelector("nav").classList.toggle("window-scroll", window.scrollY > 0)
});

// show/hide faq answer
const faqs = document.querySelectorAll(".faq");
faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("open");

        const icon = faq.querySelector(".faq__icon i");
        if (icon.className === "bx bx-plus") {
            icon.className = "bx bx-minus";
        } else {
            icon.className = "bx bx-plus";
        }
    });
});

// show/hide nav menu
const menu = document.querySelector(".nav__menu");
const menuOpenBtn = document.querySelector("#open-menu-btn");
const menuCloseBtn = document.querySelector("#close-menu-btn");

menuOpenBtn.addEventListener("click", () => {
    menu.style.display = "flex";
    menuCloseBtn.style.display = "inline-block";
    menuOpenBtn.style.display = "none";
});

menuCloseBtn.addEventListener("click", () => {
    menu.style.display = "none";
    menuCloseBtn.style.display = "none";
    menuOpenBtn.style.display = "inline-block";
});