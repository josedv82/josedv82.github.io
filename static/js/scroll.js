document.addEventListener('DOMContentLoaded', () => {
    // Get all quote sections
    const sections = document.querySelectorAll('.quote-section');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let currentSection = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;

    // Function to activate a section
    const activateSection = (index) => {
        // Deactivate all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Activate current section
        if (sections[index]) {
            sections[index].classList.add('active');
            
            // Scroll to this section
            sections[index].scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Update scroll indicator visibility
        if (index === sections.length - 1) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
    };

    // Set up Intersection Observer to detect which section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isScrolling) {
                // Find the index of the section
                const index = Array.from(sections).indexOf(entry.target);
                currentSection = index;
                activateSection(currentSection);
            }
        });
    }, {
        root: null,
        rootMargin: '-10% 0px',
        threshold: 0.5
    });

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Wheel event handler for scrolling between sections
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 800); // Prevent rapid scrolling
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            // Scroll down
            currentSection++;
            activateSection(currentSection);
        } else if (e.deltaY < 0 && currentSection > 0) {
            // Scroll up
            currentSection--;
            activateSection(currentSection);
        }
    });

    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) < 50) return; // Minimum swipe distance
        
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 800);
        
        if (deltaY > 0 && currentSection < sections.length - 1) {
            // Swipe up (scroll down)
            currentSection++;
            activateSection(currentSection);
        } else if (deltaY < 0 && currentSection > 0) {
            // Swipe down (scroll up)
            currentSection--;
            activateSection(currentSection);
        }
    });

    // Key events for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && 
            currentSection < sections.length - 1) {
            e.preventDefault();
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 800);
            currentSection++;
            activateSection(currentSection);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
            e.preventDefault();
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 800);
            currentSection--;
            activateSection(currentSection);
        }
    });

    // Initialize the first section
    if (sections.length > 0) {
        activateSection(0);
    }

    // Handle click on scroll indicator
    scrollIndicator.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            currentSection++;
            activateSection(currentSection);
        }
    });
});
