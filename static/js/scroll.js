document.addEventListener('DOMContentLoaded', () => {
    // Prevent overscroll/bounce effect
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    // Touch variables
    let touchStartY = 0;
    let touchEndY = 0;

    // DOM Elements
    const quotes = document.querySelectorAll('.quote-paragraph');
    const siteTitle = document.querySelector('.site-title');
    const parallaxBg = document.querySelector('.parallax-bg');
    const bgElements = document.querySelectorAll('.bg-element');

    // Configuration
    const config = {
        activationThreshold: 0.35,
        earlyActivationThreshold: 0.85,
        activeScale: 1.02,
        parallaxFactor: 0.4,
        inactiveOpacity: 0.1,
        approachingOpacity: 0.5,
        lastQuoteThreshold: 0.6
    };

    // Track scroll positions for velocity calculations
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollDirection = 0; // 1 = down, -1 = up, 0 = static
    let isUserScrolling = false;
    let scrollTimeout = null;

    // State for all quotes
    const quoteStates = Array.from(quotes).map(() => ({
        active: false,
        approaching: false,
        visible: false,
        progress: 0,
        distanceFromIdeal: Infinity
    }));

    /**
     * Vibration function
     */
    function triggerVibration() {
        if ("vibrate" in navigator) {
            navigator.vibrate(50); // Vibrate for 50ms
        }
    }

    /**
     * Calculate the activation progress (0-1) based on position in viewport
     */
    function calculateActivationProgress(rect, windowHeight) {
        const idealPosition = windowHeight * 0.25;
        const distanceFromIdeal = Math.abs(rect.top - idealPosition);
        const normalizedDistance = distanceFromIdeal / (windowHeight * 0.5);
        return Math.max(0, Math.min(1, 1 - normalizedDistance));
    }

    /**
     * Update the visual state of quotes based on their calculated states
     */
    function updateQuoteVisuals() {
        quotes.forEach((quote, index) => {
            const state = quoteStates[index];

            if (state.active) {
                quote.classList.add('active');
                quote.classList.remove('visible');
                quote.style.opacity = '1';
                quote.style.color = '#000000';
                quote.style.transform = `translateZ(0) scale(${config.activeScale})`;
            } else {
                quote.classList.remove('active', 'visible');
                quote.style.opacity = '0.1';
                quote.style.color = '#555';
                quote.style.transform = 'translateZ(0) scale(1)';
            }
        });
    }

    /**
     * Update parallax elements based on scroll position
     */
    function updateParallaxElements(scrollY) {
        bgElements.forEach((el, i) => {
            const speed = config.parallaxFactor * (i + 1) * 0.5;
            const yOffset = scrollY * speed;
            el.style.transform = `translateZ(-1px) scale(2) translateY(${yOffset}px)`;
        });
    }

    /**
     * Handle scrolling to a target position
     */
    function scrollToPosition(targetPosition) {
        const behavior = scrollVelocity > 40 || isUserScrolling ? 'auto' : 'smooth';
        window.scrollTo({ top: targetPosition, behavior: behavior });
    }

    /**
     * Main function to update visuals based on scroll position
     */
    function updateVisuals() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        scrollDirection = scrollY > lastScrollY ? 1 : (scrollY < lastScrollY ? -1 : 0);
        scrollVelocity = Math.abs(scrollY - lastScrollY);
        lastScrollY = scrollY;

        if (scrollY > 100) {
            siteTitle.classList.add('hidden');
        } else {
            siteTitle.classList.remove('hidden');
            siteTitle.style.transform = `translateZ(0) translateY(${scrollY * 0.2}px)`;
        }

        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            const state = quoteStates[index];
            const activationProgress = calculateActivationProgress(rect, windowHeight);
            state.progress = activationProgress;
            state.distanceFromIdeal = Math.abs(rect.top - (windowHeight * 0.25));

            const isLastQuote = index === quotes.length - 1;
            const activationThreshold = isLastQuote ? config.lastQuoteThreshold : config.activationThreshold;
            const isInActivationZone = rect.top < windowHeight * activationThreshold && rect.bottom > 0;
            const isApproaching = !isInActivationZone &&
                rect.top >= windowHeight * activationThreshold &&
                rect.top <= windowHeight * config.earlyActivationThreshold;
            const isVisible = rect.bottom > 0 && rect.top < windowHeight;

            if (state.active !== isInActivationZone) {
                triggerVibration();
            }

            state.active = isInActivationZone;
            state.approaching = isApproaching;
            state.visible = isVisible;

            if (isLastQuote && isVisible && scrollY + windowHeight >= document.body.scrollHeight - 100) {
                state.active = true;
            }
        });

        updateQuoteVisuals();
        updateParallaxElements(scrollY);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        isUserScrolling = true;
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { isUserScrolling = false; }, 100);
        const currentScrollY = window.scrollY;
        scrollVelocity = Math.abs(currentScrollY - lastScrollY);

        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateVisuals();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener('resize', updateVisuals);

    document.addEventListener('keydown', (e) => {
        const activeIndex = quoteStates.findIndex(state => state.active);
        if (activeIndex === -1) return;

        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') &&
            activeIndex < quotes.length - 1) {
            e.preventDefault();
            const nextQuote = quotes[activeIndex + 1];
            const offset = nextQuote.offsetTop - (window.innerHeight * 0.25);
            triggerVibration();
            scrollToPosition(offset);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && activeIndex > 0) {
            e.preventDefault();
            const prevQuote = quotes[activeIndex - 1];
            const offset = prevQuote.offsetTop - (window.innerHeight * 0.25);
            triggerVibration();
            scrollToPosition(offset);
        }
    });

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchStartY - touchEndY;
        if (Math.abs(deltaY) < 40) return;

        const activeIndex = quoteStates.findIndex(state => state.active);
        if (activeIndex === -1) return;

        if ((deltaY > 0 && activeIndex < quotes.length - 1) || (deltaY < 0 && activeIndex > 0)) {
            triggerVibration();
        }
    });

    updateVisuals();
});