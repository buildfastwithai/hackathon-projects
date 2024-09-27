// JavaScript to enable flipping the card on click
document.addEventListener("DOMContentLoaded", function () {
  const flipCards = document.querySelectorAll(".flip-card");

  flipCards.forEach((card) => {
    card.addEventListener("click", function () {
      const innerCard = card.querySelector(".flip-card-inner");
      innerCard.classList.toggle("flipped");
    });
  });
});
