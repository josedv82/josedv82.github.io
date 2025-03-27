document.addEventListener('DOMContentLoaded', () => {
    // Prevent overscroll/bounce effect
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Touch variables
    let touchStartY = 0;
    let touchEndY = 0;
    
    // We'll use a more gentle approach to prevent bounce without locking scrolling
    // DOM Elements
    const quotes = document.querySelectorAll('.quote-paragraph');
    const siteTitle = document.querySelector('.site-title');
    const parallaxBg = document.querySelector('.parallax-bg');
    const bgElements = document.querySelectorAll('.bg-element');
    
    // Configuration
    const config = {
        // Distance from viewport top where quotes become fully visible (percent of viewport height)
        activationThreshold: 0.35,
        // Distance from bottom of viewport where quotes start to become visible (percent of viewport height)
        earlyActivationThreshold: 0.85,
        // How much to scale active quotes
        activeScale: 1.02,
        // How fast to move background elements relative to scroll speed (lower = more dramatic parallax)
        parallaxFactor: 0.4,
        // Default opacity for inactive quotes (set to be subtle but still visible)
        inactiveOpacity: 0.1,
        // Medium opacity for quotes that are approaching but not fully active
        approachingOpacity: 0.5,
        // Special handling for the last quote to ensure it gets activated
        lastQuoteThreshold: 0.6
    };
    
    // Track scroll positions for velocity calculations
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollDirection = 0; // 1 = down, -1 = up, 0 = static
    let isUserScrolling = false; // Tracks if user is actively scrolling
    let scrollTimeout = null;
    
    // State for all quotes
    const quoteStates = Array.from(quotes).map(() => ({
        active: false,
        approaching: false,
        visible: false,
        progress: 0, // 0 to 1, how close to being fully active
        distanceFromIdeal: Infinity
    }));
    
    /**
     * Calculate the activation progress (0-1) based on position in viewport
     */
    function calculateActivationProgress(rect, windowHeight) {
        // How far from ideal position (as a percentage of window height)
        const idealPosition = windowHeight * 0.25; // 25% from top
        const distanceFromIdeal = Math.abs(rect.top - idealPosition);
        const normalizedDistance = distanceFromIdeal / (windowHeight * 0.5);
        
        // Clamp between 0 and 1, with 1 being at the ideal position
        return Math.max(0, Math.min(1, 1 - normalizedDistance));
    }
    
    /**
     * Update the visual state of quotes based on their calculated states
     */
    function updateQuoteVisuals() {
        quotes.forEach((quote, index) => {
            const state = quoteStates[index];
            
            // Base opacity and color on state - only two states now: active or inactive
            if (state.active) {
                quote.classList.add('active');
                quote.classList.remove('visible');
                quote.style.opacity = '1';
                quote.style.color = '#000000';
                quote.style.transform = translateZ(0) scale(${config.activeScale});
            } 
            else {
                // All non-active quotes are greyed out but slightly visible
                quote.classList.remove('active', 'visible');
                quote.style.opacity = '0.1'; // Decreased to make inactive text more subtle but still slightly visible
                quote.style.color = '#555';   // Darker gray for better visibility
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
            el.style.transform = translateZ(-1px) scale(2) translateY(${yOffset}px);
        });
    }
    
    /**
     * Handle scrolling to a target position with appropriate behavior
     */
    function scrollToPosition(targetPosition) {
        // Use smooth scrolling for deliberate navigation or slower scrolling
        // Use auto (instant) scrolling for fast scrolls to avoid bounce back
        const behavior = scrollVelocity > 40 || isUserScrolling ? 'auto' : 'smooth';
        
        window.scrollTo({
            top: targetPosition,
            behavior: behavior
        });
    }
    
    /**
     * Main function to update all visual elements based on scroll position
     */
    function updateVisuals() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight - windowHeight;
        const scrollY = window.scrollY;
        
        // Detect scroll direction and calculate velocity
        scrollDirection = scrollY > lastScrollY ? 1 : (scrollY < lastScrollY ? -1 : 0);
        scrollVelocity = Math.abs(scrollY - lastScrollY);
        lastScrollY = scrollY;
        
        // Handle site title visibility with a slight parallax effect
        if (scrollY > 100) {
            siteTitle.classList.add('hidden');
        } else {
            siteTitle.classList.remove('hidden');
            siteTitle.style.transform = translateZ(0) translateY(${scrollY * 0.2}px);
        }
        
        // Update each quote's state
        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            const state = quoteStates[index];
            
            // Calculate how far this quote is from the ideal position (for activation)
            const activationProgress = calculateActivationProgress(rect, windowHeight);
            state.progress = activationProgress;
            state.distanceFromIdeal = Math.abs(rect.top - (windowHeight * 0.25));
            
            // Special handling for the last quote
            const isLastQuote = index === quotes.length - 1;
            
            // Determine if the quote is active (in the target activation zone)
            // For the last quote, use a more generous activation zone
            const activationThreshold = isLastQuote ? config.lastQuoteThreshold : config.activationThreshold;
            const isInActivationZone = rect.top < windowHeight * activationThreshold && rect.bottom > 0;
            
            // Determine if the quote is approaching activation (for early fading in)
            const isApproaching = !isInActivationZone && 
                rect.top >= windowHeight * activationThreshold && 
                rect.top <= windowHeight * config.earlyActivationThreshold;
            
            // Determine if the quote is at all visible
            const isVisible = rect.bottom > 0 && rect.top < windowHeight;
            
            // Update state
            state.active = isInActivationZone;
            state.approaching = isApproaching;
            state.visible = isVisible;
            
            // Force the last quote to be active when it's visible near the bottom of the screen
            if (isLastQuote && isVisible && scrollY + windowHeight >= document.body.scrollHeight - 100) {
                state.active = true;
            }
        });
        
        // Find the most visible quote in the activation zone
        const activeQuotes = quoteStates
            .map((state, index) => ({ ...state, index }))
            .filter(state => state.active || state.approaching)
            .sort((a, b) => a.distanceFromIdeal - b.distanceFromIdeal);
        
        // Always prioritize quotes in the active zone over approaching quotes
        activeQuotes.sort((a, b) => {
            if (a.active && !b.active) return -1;
            if (!a.active && b.active) return 1;
            return 0;
        });
        
        // Make sure we have at least one highlighted quote when possible
        if (activeQuotes.length > 0 && !activeQuotes.some(q => q.active)) {
            quoteStates[activeQuotes[0].index].active = true;
        }
        
        // Update visual appearance based on calculated states
        updateQuoteVisuals();
        
        // Update parallax elements
        updateParallaxElements(scrollY);
    }
    
    // Optimize scroll event handling
    let ticking = false;
    window.addEventListener('scroll', () => {
        // Update flag to indicate user is actively scrolling
        isUserScrolling = true;
        
        // Clear existing timeout to reset the timer
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set a timeout to detect when scrolling stops
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 100); // Consider scrolling stopped after 100ms of inactivity
        
        // Calculate scroll velocity for this event
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
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateVisuals();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Find current active quote
        const activeIndex = quoteStates.findIndex(state => state.active);
        
        if (activeIndex === -1) return;
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && 
            activeIndex < quotes.length - 1) {
            // Move to next quote
            e.preventDefault();
            const nextQuote = quotes[activeIndex + 1];
            const offset = nextQuote.offsetTop - (window.innerHeight * 0.25);
            
            scrollToPosition(offset);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && activeIndex > 0) {
            // Move to previous quote
            e.preventDefault();
            const prevQuote = quotes[activeIndex - 1];
            const offset = prevQuote.offsetTop - (window.innerHeight * 0.25);
            
            scrollToPosition(offset);
        }
    });
    
    // Touch navigation - using the variables declared at the top
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchStartY - touchEndY;
        
        // Minimum swipe distance (40px)
        if (Math.abs(deltaY) < 40) return;
        
        // Find current active quote
        const activeIndex = quoteStates.findIndex(state => state.active);
        if (activeIndex === -1) return;
        
        if (deltaY > 0 && activeIndex < quotes.length - 1) {
            // Swipe up (scroll down)
            const nextQuote = quotes[activeIndex + 1];
            const offset = nextQuote.offsetTop - (window.innerHeight * 0.25);
            
            scrollToPosition(offset);
        } else if (deltaY < 0 && activeIndex > 0) {
            // Swipe down (scroll up)
            const prevQuote = quotes[activeIndex - 1];
            const offset = prevQuote.offsetTop - (window.innerHeight * 0.25);
            
            scrollToPosition(offset);
        }
    });
    
    // Initialize on page load
    updateVisuals();
});