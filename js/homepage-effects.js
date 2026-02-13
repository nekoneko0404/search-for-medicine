// Homepage visual effects
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes if they exist
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-up');
    animatedElements.forEach(el => observer.observe(el));
});
