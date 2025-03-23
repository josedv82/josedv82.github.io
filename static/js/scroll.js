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
    
    // Activate the first three quotes on page load
    if (quotes.length > 0) {
        for (let i = 0; i < Math.min(3, quotes.length); i++) {
            quotes[i].classList.add('active');
            quotes[i].style.opacity = '1';
            quotes[i].style.color = '#000000';
            highlightedQuotes.add(i);
        }
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
            for (let i = 0; i < Math.min(3, quotes.length); i++) {
                quotes[i].classList.add('active');
                quotes[i].style.opacity = '1';
                quotes[i].style.color = '#000000';
                highlightedQuotes.add(i);
            }
            
            // Update last scroll position and return
            lastScrollTop = scrollPosition;
            return;
        }
        
        // Find the quotes that should be highlighted now based on viewport position
        let currentHighlights = [];
        
        // Find which quotes are in the viewport
        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            
            // Check if quote is near the top of the viewport or partially visible
            const isNearTop = rect.top >= -100 && rect.top <= windowHeight * 0.4;
            const isPartiallyVisible = (rect.top < windowHeight && rect.bottom > 0);
            
            if (isNearTop || isPartiallyVisible) {
                const proximityToIdeal = Math.abs(rect.top - windowHeight * 0.2);
                currentHighlights.push({
                    index: index,
                    proximity: proximityToIdeal
                });
            }
        });
        
        // Sort by proximity to ideal position
        currentHighlights.sort((a, b) => a.proximity - b.proximity);
        
        // If we're scrolling down, highlight current and next quotes
        if (!scrollingUp && currentHighlights.length > 0) {
            // Get the primary quote to highlight
            const primaryIndex = currentHighlights[0].index;
            
            // Always highlight the primary quote
            quotes[primaryIndex].classList.add('active');
            quotes[primaryIndex].style.opacity = '1';
            quotes[primaryIndex].style.color = '#000000';
            highlightedQuotes.add(primaryIndex);
            
            // Highlight quotes around the primary one
            if (primaryIndex > 0) {
                quotes[primaryIndex - 1].classList.add('active');
                quotes[primaryIndex - 1].style.opacity = '1';
                quotes[primaryIndex - 1].style.color = '#000000';
                highlightedQuotes.add(primaryIndex - 1);
            }
            
            if (primaryIndex < quotes.length - 1) {
                quotes[primaryIndex + 1].classList.add('active');
                quotes[primaryIndex + 1].style.opacity = '1';
                quotes[primaryIndex + 1].style.color = '#000000';
                highlightedQuotes.add(primaryIndex + 1);
            }
        } 
        // When scrolling up, make sure all previously highlighted quotes stay highlighted
        else if (scrollingUp) {
            // Make sure all previously highlighted quotes remain highlighted
            highlightedQuotes.forEach(index => {
                quotes[index].classList.add('active');
                quotes[index].style.opacity = '1';
                quotes[index].style.color = '#000000';
            });
            
            // Additionally, highlight quotes around the current visible ones if they exist
            if (currentHighlights.length > 0) {
                const primaryIndex = currentHighlights[0].index;
                
                // Only add new highlights that weren't already highlighted
                if (primaryIndex > 0 && !highlightedQuotes.has(primaryIndex - 1)) {
                    quotes[primaryIndex - 1].classList.add('active');
                    quotes[primaryIndex - 1].style.opacity = '1';
                    quotes[primaryIndex - 1].style.color = '#000000';
                    highlightedQuotes.add(primaryIndex - 1);
                }
                
                if (primaryIndex < quotes.length - 1 && !highlightedQuotes.has(primaryIndex + 1)) {
                    quotes[primaryIndex + 1].classList.add('active');
                    quotes[primaryIndex + 1].style.opacity = '1';
                    quotes[primaryIndex + 1].style.color = '#000000';
                    highlightedQuotes.add(primaryIndex + 1);
                }
            }
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
        // Find currently active quote
        const activeQuote = document.querySelector('.quote-paragraph.active');
        if (!activeQuote) return;
        
        const currentIndex = Array.from(quotes).indexOf(activeQuote);
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && 
            currentIndex < quotes.length - 1) {
            // Next quote
            e.preventDefault();
            const nextQuote = quotes[currentIndex + 1];
            const offset = nextQuote.offsetTop - window.innerHeight / 3;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIndex > 0) {
            // Previous quote
            e.preventDefault();
            const prevQuote = quotes[currentIndex - 1];
            const offset = prevQuote.offsetTop - window.innerHeight / 3;
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
            const offset = nextQuote.offsetTop - window.innerHeight / 3;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        } else if (deltaY < 0 && currentIndex > 0) {
            // Swipe down (scroll up)
            const prevQuote = quotes[currentIndex - 1];
            const offset = prevQuote.offsetTop - window.innerHeight / 3;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    });
});
