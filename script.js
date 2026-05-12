const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const loader = document.querySelector(".loader");
const backTop = document.querySelector(".back-top");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const bookingForm = document.querySelector("#bookingForm");
const modal = document.querySelector("#bookingModal");
const modalClose = document.querySelector(".modal-close");
const bookingSummary = document.querySelector("#bookingSummary");
const newsletter = document.querySelector(".newsletter");

let currentSlide = 0;
let carouselTimer;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
  backTop.classList.toggle("show", window.scrollY > 500);
}

window.addEventListener("scroll", updateHeader);
updateHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function showSlide(index) {
  slides[currentSlide].classList.remove("active");
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

function startCarousel() {
  carouselTimer = setInterval(() => showSlide(currentSlide + 1), 4500);
}

function resetCarousel() {
  clearInterval(carouselTimer);
  startCarousel();
}

nextBtn.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  resetCarousel();
});

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  resetCarousel();
});

startCarousel();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

document.querySelectorAll(".page-section").forEach((section) => {
  sectionObserver.observe(section);
});

function openModal(message) {
  bookingSummary.textContent = message;
  modal.classList.add("show");
  body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("show");
  body.classList.remove("modal-open");
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const checkIn = document.querySelector("#checkIn").value;
  const checkOut = document.querySelector("#checkOut").value;
  const guests = document.querySelector("#guests").value;
  const roomType = document.querySelector("#roomType").value;

  if (checkOut <= checkIn) {
    openModal("Please choose a check-out date after your check-in date.");
    return;
  }

  openModal(
    `Thank you. Your ${roomType} request for ${guests} guest(s), from ${checkIn} to ${checkOut}, has been received. Our reservations team will confirm availability and apply the 12% first booking offer when eligible.`
  );

  bookingForm.reset();
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) closeModal();
});

newsletter.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = newsletter.querySelector("input");
  openModal(`Thank you for subscribing. 9STAR updates will be sent to ${emailInput.value}.`);
  newsletter.reset();
});
