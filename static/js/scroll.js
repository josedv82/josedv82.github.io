document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const quotes = document.querySelectorAll('.quote-paragraph');
    const progressBar = document.getElementById('progress-bar');
    const siteTitle = document.querySelector('.site-title');
    
    // Define how many quotes to highlight at a time (just like White Mirror)
    const VISIBLE_QUOTES_COUNT = 2;
    
    // Calculate which quotes are visible based on scroll position
    const updateActiveQuotes = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight - windowHeight;
        const scrollPosition = window.scrollY;
        
        // Update progress bar
        const progress = (scrollPosition / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Handle title visibility
        if (scrollPosition > 50) {
            siteTitle.classList.add('hidden');
        } else {
            siteTitle.classList.remove('hidden');
        }
        
        // Reset all quotes to low opacity first
        quotes.forEach(quote => {
            quote.classList.remove('active');
            quote.style.opacity = '0.03';
            quote.style.color = '#666';
        });
        
        // Calculate which quotes should be active based on scroll position
        let activeIndex = 0;
        let bestVisibility = -Infinity;
        
        // Special handling for top of page - show first quote(s)
        if (scrollPosition < 100) {
            for (let i = 0; i < Math.min(VISIBLE_QUOTES_COUNT, quotes.length); i++) {
                quotes[i].classList.add('active');
                quotes[i].style.opacity = '1';
                quotes[i].style.color = '#000000';
            }
            return;
        }

        // Find quotes that are approaching the viewport or already in it
        let visibleQuotes = [];
        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            
            // Highlight quotes that are:
            // 1. Already in the top portion of the viewport OR
            // 2. Approaching the viewport from below (start highlighting them sooner)
            const isInTopPortion = rect.top < windowHeight * 0.4 && rect.bottom > 0;
            const isApproaching = rect.top >= windowHeight * 0.4 && rect.top <= windowHeight * 0.95;
            
            if (isInTopPortion || isApproaching) {
                // Calculate distance from ideal position (top 20% of screen)
                const distance = Math.abs(rect.top - (windowHeight * 0.2));
                
                visibleQuotes.push({
                    index: index,
                    topPosition: rect.top, // Distance from top of viewport
                    distance: distance // Distance from ideal position
                });
            }
        });
        
        // Sort quotes by their position AND distance from ideal position (which is top 20% of viewport)
        // For quotes above the ideal line, prioritize those closest to it, top to bottom
        // For quotes below, prioritize closest to entering the ideal zone
        visibleQuotes.sort((a, b) => {
            // If one is above the ideal line and one is below, prioritize the one above
            const aAboveIdeal = a.topPosition < windowHeight * 0.4;
            const bAboveIdeal = b.topPosition < windowHeight * 0.4;
            
            if (aAboveIdeal && !bAboveIdeal) return -1;
            if (!aAboveIdeal && bAboveIdeal) return 1;
            
            // Both are in the same zone, so sort by distance from ideal position
            return a.distance - b.distance;
        });
        
        // Take top N quotes for highlighting (or fewer if not enough are visible)
        const quotesToHighlight = visibleQuotes.slice(0, VISIBLE_QUOTES_COUNT);
        
        // If we found visible quotes, highlight them
        if (quotesToHighlight.length > 0) {
            quotesToHighlight.forEach(item => {
                quotes[item.index].classList.add('active');
                quotes[item.index].style.opacity = '1';
                quotes[item.index].style.color = '#000000';
            });
        } else {
            // Fallback - find the quote closest to entering the viewport from the bottom
            let closestQuote = null;
            let minDistance = Infinity;
            
            quotes.forEach((quote, index) => {
                const rect = quote.getBoundingClientRect();
                // If quote is below viewport, calculate how far
                if (rect.top > windowHeight * 0.4) {
                    const distance = rect.top - windowHeight * 0.4;
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestQuote = index;
                    }
                }
            });
            
            if (closestQuote !== null) {
                quotes[closestQuote].classList.add('active');
                quotes[closestQuote].style.opacity = '1';
                quotes[closestQuote].style.color = '#000000';
            }
        }
    };
    
    // Optimized scroll handling with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveQuotes();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Update on resize
    window.addEventListener('resize', () => {
        updateActiveQuotes();
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Find currently active quote
        const activeQuote = document.querySelector('.quote-paragraph.active');
        if (!activeQuote) return;
        
        const currentIndex = Array.from(quotes).indexOf(activeQuote);
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && 
            currentIndex < quotes.length - 1) {
            // Next quote
            e.preventDefault();
            const nextQuote = quotes[currentIndex + 1];
            const offset = nextQuote.offsetTop - 10; // Position at top of viewport
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIndex > 0) {
            // Previous quote
            e.preventDefault();
            const prevQuote = quotes[currentIndex - 1];
            const offset = prevQuote.offsetTop - 10; // Position at top of viewport
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    });
    
    // Initialize on page load
    updateActiveQuotes();
    
    // Add touch swipe handling for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchStartY - touchEndY;
        
        // Minimum swipe distance (50px)
        if (Math.abs(deltaY) < 50) return;
        
        // Find currently active quote
        const activeQuote = document.querySelector('.quote-paragraph.active');
        if (!activeQuote) return;
        
        const currentIndex = Array.from(quotes).indexOf(activeQuote);
        
        if (deltaY > 0 && currentIndex < quotes.length - 1) {
            // Swipe up (scroll down)
            const nextQuote = quotes[currentIndex + 1];
            const offset = nextQuote.offsetTop - 10;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        } else if (deltaY < 0 && currentIndex > 0) {
            // Swipe down (scroll up)
            const prevQuote = quotes[currentIndex - 1];
            const offset = prevQuote.offsetTop - 10;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    });
});
