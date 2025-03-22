document.addEventListener('DOMContentLoaded', () => {
    // Get all quote paragraphs
    const quotes = document.querySelectorAll('.quote-paragraph');
    const progressBar = document.getElementById('progress-bar');
    
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
        
        // Check each quote's position
        quotes.forEach((quote, index) => {
            const rect = quote.getBoundingClientRect();
            const quoteTop = rect.top;
            const quoteHeight = rect.height;
            
            // Calculate the position relative to the viewport
            // A quote is considered "active" when its top is in the middle third of the screen
            const viewportMiddle = windowHeight / 2;
            const threshold = windowHeight / 3;
            
            if (quoteTop < viewportMiddle + threshold && 
                quoteTop > viewportMiddle - threshold) {
                quote.classList.add('active');
            } else {
                quote.classList.remove('active');
            }
        });
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
