// DARK/LIGHT MODE
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// ACTIVE NAV LINK ON SCROLL
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 60;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
  });
});

// REVEAL ON SCROLL
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".card").forEach(el => observer.observe(el));

// PROJECT CAROUSEL
const carousel = document.querySelector(".projects-carousel");
document.querySelector(".carousel-btn.left").onclick = () => {
  carousel.scrollBy({ left: -300, behavior: "smooth" });
};
document.querySelector(".carousel-btn.right").onclick = () => {
  carousel.scrollBy({ left: 300, behavior: "smooth" });
};
