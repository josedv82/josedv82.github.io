document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const quotes = document.querySelectorAll('.quote-paragraph');
    const progressBar = document.getElementById('progress-bar');
    const siteTitle = document.querySelector('.site-title');
    
    // Last scroll position for detecting scroll direction
    let lastScrollTop = 0;
    
    // Activate the first three quotes on page load
    if (quotes.length > 0) {
        for (let i = 0; i < Math.min(3, quotes.length); i++) {
            quotes[i].classList.add('active');
            quotes[i].style.opacity = '1';
            quotes[i].style.color = '#000000';
        }
    }
    
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
        
        // Find quotes that should be highlighted based on viewport position
        let visibleQuotes = [];
        
        // Check each quote's position relative to the viewport
        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            
            // Reset styling for all quotes first
            quote.classList.remove('active');
            quote.style.opacity = '0.03';
            quote.style.color = '#666';
            
            // Consider a quote visible if:
            // 1. It's near the top of the viewport (more sensitive detection) OR
            // 2. It's partially visible anywhere in the viewport OR
            // 3. It's the first quote in the document and we're at the top
            
            // More sensitive top detection - highlight as soon as the quote enters viewport
            const isNearTop = rect.top >= -100 && rect.top <= windowHeight * 0.4;
            
            // Any part of the quote is visible in the viewport
            const isPartiallyVisible = (rect.top < windowHeight && rect.bottom > 0);
            
            const isFirstQuoteAtTop = index === 0 && scrollPosition < 50;
            
            // Weight by proximity to the ideal position (near top of viewport)
            const proximityToIdeal = Math.abs(rect.top - windowHeight * 0.2);
            
            if (isNearTop || isPartiallyVisible || isFirstQuoteAtTop) {
                visibleQuotes.push({
                    quote: quote,
                    index: index,
                    top: rect.top,
                    proximity: proximityToIdeal
                });
            }
        });
        
        // Sort by proximity to ideal position first (closest to top)
        visibleQuotes.sort((a, b) => a.proximity - b.proximity);
        
        // For quotes in the viewport or just scrolled past, highlight them
        // We always want to highlight at least 3 quotes if possible
        
        // Start with the default behavior for the top of the page
        if (scrollPosition < 50) {
            for (let i = 0; i < Math.min(3, quotes.length); i++) {
                quotes[i].classList.add('active');
                quotes[i].style.opacity = '1';
                quotes[i].style.color = '#000000'; 
            }
            return;
        }
        
        // If we have visible quotes, determine which ones to highlight
        if (visibleQuotes.length > 0) {
            // Find the primary quote (the one most prominently in view)
            const primaryIndex = visibleQuotes[0].index;
            
            // Always highlight the primary quote
            quotes[primaryIndex].classList.add('active');
            quotes[primaryIndex].style.opacity = '1';
            quotes[primaryIndex].style.color = '#000000';
            
            // Highlight one quote above and one below if they exist
            if (primaryIndex > 0) {
                quotes[primaryIndex - 1].classList.add('active');
                quotes[primaryIndex - 1].style.opacity = '1';
                quotes[primaryIndex - 1].style.color = '#000000';
            }
            
            if (primaryIndex < quotes.length - 1) {
                quotes[primaryIndex + 1].classList.add('active');
                quotes[primaryIndex + 1].style.opacity = '1';
                quotes[primaryIndex + 1].style.color = '#000000';
            }
            
            // If we need more to reach 3 highlights, add them
            if (primaryIndex > 1 && (primaryIndex === quotes.length - 1 || primaryIndex === 0)) {
                quotes[primaryIndex - 2].classList.add('active');
                quotes[primaryIndex - 2].style.opacity = '1';
                quotes[primaryIndex - 2].style.color = '#000000';
            } else if (primaryIndex < quotes.length - 2 && (primaryIndex === 0 || primaryIndex === 1)) {
                quotes[primaryIndex + 2].classList.add('active');
                quotes[primaryIndex + 2].style.opacity = '1';
                quotes[primaryIndex + 2].style.color = '#000000';
            }
        } else {
            // Fallback: Highlight the first 3 quotes if nothing is visible
            for (let i = 0; i < Math.min(3, quotes.length); i++) {
                quotes[i].classList.add('active');
                quotes[i].style.opacity = '1';
                quotes[i].style.color = '#000000';
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
