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
        
        // First, reset all quotes to very low opacity and remove active class
        quotes.forEach(quote => {
            quote.classList.remove('active');
            quote.style.opacity = '0.03'; // Extremely faded when not highlighted
            quote.style.color = '#666'; // Light gray for non-highlighted text
        });
        
        // Start with first 3 quotes highlighted on page load when at top
        if (scrollPosition < 50) {
            // Highlight the first 3 quotes at the beginning
            for (let i = 0; i < Math.min(3, quotes.length); i++) {
                quotes[i].classList.add('active');
                quotes[i].style.opacity = '1';
                quotes[i].style.color = '#000000'; // Very black
            }
            return; // Exit early if we're at the top
        }
        
        // Otherwise, determine which quotes to highlight based on scroll position
        // Find the furthest down quote that's already crossed the top of the viewport
        let lastHighlightedIndex = -1;
        
        for (let i = 0; i < quotes.length; i++) {
            const rect = quotes[i].getBoundingClientRect();
            // If the quote's top is already below the top of the viewport
            if (rect.top <= 0) {
                lastHighlightedIndex = i;
            } else {
                // Once we find a quote that hasn't crossed the top, stop checking
                break;
            }
        }
        
        // If we found a quote that's crossed the top, highlight it and 2 before it (if available)
        if (lastHighlightedIndex >= 0) {
            // Start highlighting from 2 quotes before the last highlighted one
            const startIndex = Math.max(0, lastHighlightedIndex - 2);
            
            // Highlight 3 quotes total (or fewer if not enough quotes)
            for (let i = startIndex; i <= lastHighlightedIndex; i++) {
                quotes[i].classList.add('active');
                quotes[i].style.opacity = '1';
                quotes[i].style.color = '#000000';
            }
            
            // If there's at least one more quote after the last highlighted one, highlight it as well
            // This ensures the next quote that's about to become visible is also highlighted
            if (lastHighlightedIndex < quotes.length - 1) {
                quotes[lastHighlightedIndex + 1].classList.add('active');
                quotes[lastHighlightedIndex + 1].style.opacity = '1';
                quotes[lastHighlightedIndex + 1].style.color = '#000000';
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
