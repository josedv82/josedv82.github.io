document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const quotes = document.querySelectorAll('.quote-paragraph');
    const progressBar = document.getElementById('progress-bar');
    const siteTitle = document.querySelector('.site-title');
    
    // Last scroll position for detecting scroll direction
    let lastScrollTop = 0;
    
    // Track which quotes have been highlighted already
    // Once a quote is highlighted, it remains highlighted when scrolling up
    const highlightedQuotes = new Set();
    
    // Only activate the first quote initially
    if (quotes.length > 0) {
        quotes[0].classList.add('active');
        quotes[0].style.opacity = '1';
        quotes[0].style.color = '#000000';
        highlightedQuotes.add(0);
    }
    
    // Calculate which quotes are visible based on scroll position
    const updateActiveQuotes = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight - windowHeight;
        const scrollPosition = window.scrollY;
        const scrollingUp = scrollPosition < lastScrollTop;
        
        // Update progress bar
        const progress = (scrollPosition / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Handle title visibility
        if (scrollPosition > 50) {
            siteTitle.classList.add('hidden');
        } else {
            siteTitle.classList.remove('hidden');
        }
        
        // Reset all quotes to initial state first
        quotes.forEach((quote, index) => {
            // When scrolling up, don't unhighlight quotes that were already highlighted
            if (!scrollingUp || !highlightedQuotes.has(index)) {
                quote.classList.remove('active');
                quote.style.opacity = '0.03';
                quote.style.color = '#666';
            }
        });
        
        // Special case for top of page
        if (scrollPosition < 50) {
            // Only highlight the first quote
            quotes[0].classList.add('active');
            quotes[0].style.opacity = '1';
            quotes[0].style.color = '#000000';
            highlightedQuotes.add(0);
            
            // Update last scroll position and return
            lastScrollTop = scrollPosition;
            return;
        }
        
        // Find the quote that should be highlighted now based on viewport position
        let nextQuoteToHighlight = null;
        let bestProximity = Infinity;
        
        // Find which quote is best positioned to be highlighted next
        quotes.forEach((quote, index) => {
            if (highlightedQuotes.has(index)) return; // Skip already highlighted quotes
            
            const rect = quote.getBoundingClientRect();
            
            // A quote is eligible to be highlighted if it's approaching the top of the viewport
            const isApproachingTop = rect.top >= -50 && rect.top <= windowHeight * 0.3;
            
            if (isApproachingTop) {
                // Choose the quote closest to the ideal position (top of viewport)
                const proximityToIdeal = Math.abs(rect.top - 10); // 10px from top is ideal
                
                if (proximityToIdeal < bestProximity) {
                    bestProximity = proximityToIdeal;
                    nextQuoteToHighlight = {
                        index: index,
                        proximity: proximityToIdeal
                    };
                }
            }
        });
        
        // If we're scrolling down and found a quote to highlight
        if (!scrollingUp && nextQuoteToHighlight) {
            // Highlight just this one quote
            const index = nextQuoteToHighlight.index;
            quotes[index].classList.add('active');
            quotes[index].style.opacity = '1';
            quotes[index].style.color = '#000000';
            highlightedQuotes.add(index);
        } 
        // When scrolling up, make sure all previously highlighted quotes stay highlighted
        else if (scrollingUp) {
            // Just keep all previously highlighted quotes highlighted
            highlightedQuotes.forEach(index => {
                quotes[index].classList.add('active');
                quotes[index].style.opacity = '1';
                quotes[index].style.color = '#000000';
            });
        }
        
        // Update last scroll position
        lastScrollTop = scrollPosition;
    };
    
    // Handle scrolling with requestAnimationFrame for better performance
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
    let resizeTicking = false;
    window.addEventListener('resize', () => {
        if (!resizeTicking) {
            window.requestAnimationFrame(() => {
                updateActiveQuotes();
                resizeTicking = false;
            });
            resizeTicking = true;
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Find the furthest down highlighted quote (default to 0 if none are highlighted)
        const highlightedIndices = Array.from(highlightedQuotes);
        const latestIndex = highlightedIndices.length > 0 ? Math.max(...highlightedIndices) : 0;
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && 
            latestIndex < quotes.length - 1) {
            // Go to next quote after the latest highlighted one
            e.preventDefault();
            const nextQuote = quotes[latestIndex + 1];
            const offset = nextQuote.offsetTop - 20; // Position it at the top of the viewport
            
            // Also highlight this quote immediately
            nextQuote.classList.add('active');
            nextQuote.style.opacity = '1';
            nextQuote.style.color = '#000000';
            highlightedQuotes.add(latestIndex + 1);
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && latestIndex > 0) {
            // Go to previous highlighted quote
            e.preventDefault();
            
            // Find the previous highlighted quote
            let targetIndex = latestIndex - 1;
            while (targetIndex > 0 && !highlightedQuotes.has(targetIndex)) {
                targetIndex--;
            }
            
            const prevQuote = quotes[targetIndex];
            const offset = prevQuote.offsetTop - 20;
            
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
        
        // Find the furthest down highlighted quote (default to 0 if none are highlighted)
        const highlightedIndices = Array.from(highlightedQuotes);
        const latestIndex = highlightedIndices.length > 0 ? Math.max(...highlightedIndices) : 0;
        
        if (deltaY > 0 && latestIndex < quotes.length - 1) {
            // Swipe up (scroll down) to next quote
            const nextQuote = quotes[latestIndex + 1];
            const offset = nextQuote.offsetTop - 20;
            
            // Also highlight this quote immediately
            nextQuote.classList.add('active');
            nextQuote.style.opacity = '1';
            nextQuote.style.color = '#000000';
            highlightedQuotes.add(latestIndex + 1);
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        } else if (deltaY < 0 && latestIndex > 0) {
            // Swipe down (scroll up) to previous highlighted quote
            let targetIndex = latestIndex - 1;
            while (targetIndex > 0 && !highlightedQuotes.has(targetIndex)) {
                targetIndex--;
            }
            
            const prevQuote = quotes[targetIndex];
            const offset = prevQuote.offsetTop - 20;
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    });
});
