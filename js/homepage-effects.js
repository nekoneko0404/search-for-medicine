// Homepage visual effects
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For v2.css .mag-card
                entry.target.classList.add('reveal');
                // For other generic animations
                entry.target.classList.add('visible');

                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe mag-cards for v2 design
    const magCards = document.querySelectorAll('.mag-card');
    magCards.forEach((el, index) => {
        // Add staggered delay for visual effect
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Observe other elements with generic animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-up');
    animatedElements.forEach(el => observer.observe(el));
});
