document.addEventListener('DOMContentLoaded', () => {
    // Set up Intersection Observer
    const options = {
        root: null, // Use the viewport
        rootMargin: '0px',
        threshold: 0.7 // When 70% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, options);

    // Observe all quote sections
    const sections = document.querySelectorAll('.quote-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling function
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Make first quote visible immediately
    if (sections.length > 0) {
        sections[0].classList.add('visible');
    }
});
