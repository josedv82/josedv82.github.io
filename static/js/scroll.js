document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const quotes = document.querySelectorAll('.quote-paragraph');
    const progressBar = document.getElementById('progress-bar');
    const siteTitle = document.querySelector('.site-title');
    
    // Last scroll position for detecting scroll direction
    let lastScrollTop = 0;
    
    // Activate the first quote on page load
    if (quotes.length > 0) {
        quotes[0].classList.add('active');
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
        
        // Create an array to store quotes by their position from top of viewport
        const visibleQuotes = [];
        
        // First, reset all quotes to very low opacity and remove active class
        quotes.forEach(quote => {
            quote.classList.remove('active');
            quote.style.opacity = '0.05'; // Very very greyed out (barely visible)
        });
        
        // Find quotes that are visible in the viewport
        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            
            // If the quote is visible in the viewport (wholly or partially)
            if (rect.top < windowHeight && rect.bottom > 0) {
                visibleQuotes.push({
                    quote: quote,
                    index: index,
                    top: rect.top // Store the top position
                });
            }
        });
        
        // Sort by top position (top to bottom)
        visibleQuotes.sort((a, b) => a.top - b.top);
        
        // Highlight at least 3 quotes, starting from the top
        const numToHighlight = Math.max(3, visibleQuotes.length);
        
        // Highlight visible quotes from the top down
        for (let i = 0; i < Math.min(numToHighlight, visibleQuotes.length); i++) {
            if (i === 0) {
                // Primary (top) quote - fully visible and black
                visibleQuotes[i].quote.classList.add('active');
                visibleQuotes[i].quote.style.opacity = '1';
                visibleQuotes[i].quote.style.color = '#000000'; // Make sure it's very black
            } else if (i < 3) {
                // Next two quotes - more visible but still faded
                visibleQuotes[i].quote.style.opacity = i === 1 ? '0.4' : '0.2';
            } else {
                // Any additional visible quotes
                visibleQuotes[i].quote.style.opacity = '0.1';
            }
        }
        
        // Update last scroll position
        lastScrollTop = scrollPosition;
    };
    
    // Handle scrolling
    window.addEventListener('scroll', () => {
        updateActiveQuotes();
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
