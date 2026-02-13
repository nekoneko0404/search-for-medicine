// js/homepage-effects.js
// Scroll reveal animation and hero section effects for the homepage

// Intersection Observer for scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.mag-card').forEach(card => observer.observe(card));

// Stagger hero lines
document.querySelectorAll('.hero-content h1 span').forEach((span, index) => {
    span.style.animationDelay = `${index * 0.2}s`;
});
