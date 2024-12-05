document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("modal");
    var modalText = document.getElementById("modal-text");
    var modalIllustration = document.getElementById("modal-illustration");
    var toast = document.getElementById("toast");

    // Function to check if an image exists
    function imageExists(imageUrl, callback) {
        var img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = imageUrl;
    }

    // Function to check and append icon if illustration exists
    function checkAndAppendIcon(item) {
        var illustrationUrl = `illustrations/${item.id}.png`;
        imageExists(illustrationUrl, function(exists) {
            if (exists) {
                var icon = document.createElement('i');
                icon.className = 'fas fa-pencil text-icon';
                icon.style.display = 'none'; // Ensure icon is hidden by default
                icon.addEventListener('click', function() {
                    openModal(item);
                });
                item.appendChild(icon);
                item.setAttribute('data-illustration', 'true');
            } else {
                item.setAttribute('data-illustration', 'false');
            }
        });
    }

    // Initialize and check each quote
    document.querySelectorAll('ul#reflections li').forEach(item => {
        const categoryLabel = document.createElement('span');
        categoryLabel.className = 'category-label';
    
        // Use manual category if specified, otherwise fallback to auto categorization
        const category = item.getAttribute('data-category') || getCategory(item.innerText);
    
        categoryLabel.textContent = category;
        item.insertBefore(categoryLabel, item.firstChild);
        checkAndAppendIcon(item); // Assuming this function exists
    });
    

        // Add action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'card-actions';

        // Copy button
        const copyButton = document.createElement('i');
        copyButton.className = 'fas fa-copy card-action-icon';
        copyButton.title = 'Copy to clipboard';
        copyButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const textWithoutLabel = item.innerText.replace(item.querySelector('.category-label').innerText, '').trim();
            copyToClipboard(textWithoutLabel);
        });

        // Tweet button
        const tweetButton = document.createElement('i');
        tweetButton.className = 'fab fa-twitter card-action-icon';
        tweetButton.title = 'Share on Twitter';
        tweetButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const textWithoutLabel = item.innerText.replace(item.querySelector('.category-label').innerText, '').trim();
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textWithoutLabel)}`;
            window.open(twitterUrl, '_blank');
        });

        // Bluesky button
        const blueskyButton = document.createElement('i');
        blueskyButton.className = 'fas fa-feather card-action-icon';
        blueskyButton.title = 'Share on Bluesky';
        blueskyButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const textWithoutLabel = item.innerText.replace(item.querySelector('.category-label').innerText, '').trim();
            const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(textWithoutLabel)}`;
            window.open(blueskyUrl, '_blank');
        });

        // Share toggle button
        const shareButton = document.createElement('i');
        shareButton.className = 'fa-solid fa-angle-right card-action-icon share-toggle';

        shareButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = shareOptionsDiv.style.display === 'flex';
            shareOptionsDiv.style.display = isVisible ? 'none' : 'flex';
            
            // Toggle between angle-right and circle-xmark
            if (isVisible) {
                shareButton.className = 'fa-solid fa-angle-right card-action-icon share-toggle';
            } else {
                shareButton.className = 'fa-solid fa-circle-xmark card-action-icon share-toggle';
            }
        });

        // Create container for share options
        const shareOptionsDiv = document.createElement('div');
        shareOptionsDiv.className = 'share-options';
        shareOptionsDiv.style.display = 'none'; // Hidden by default

        // Add the existing buttons to the share options div instead of actionsDiv
        shareOptionsDiv.appendChild(copyButton);
        shareOptionsDiv.appendChild(tweetButton);
        shareOptionsDiv.appendChild(blueskyButton);

        // Add all elements to the card
        actionsDiv.appendChild(shareButton);
        actionsDiv.appendChild(shareOptionsDiv);
        item.appendChild(actionsDiv);

        // Keep the illustration icon functionality
        item.addEventListener('mouseenter', function () {
            if (item.getAttribute('data-illustration') === 'true') {
                item.querySelector('.text-icon').style.display = 'inline';
            }
        });

        item.addEventListener('mouseleave', function () {
            if (item.getAttribute('data-illustration') === 'true') {
                item.querySelector('.text-icon').style.display = 'none';
            }
        });
    });

    function openModal(item) {
        // Get text content excluding the category label
        const textWithoutLabel = item.innerText.replace(item.querySelector('.category-label').innerText, '').trim();
        modalText.innerText = textWithoutLabel;
        
        var illustrationUrl = `illustrations/${item.id}.png`;
        if (item.getAttribute('data-illustration') === 'true') {
            imageExists(illustrationUrl, function(exists) {
                if (exists) {
                    modalIllustration.src = illustrationUrl;
                    modalIllustration.style.display = "block";
                } else {
                    modalIllustration.style.display = "none";
                }
            });
        } else {
            modalIllustration.style.display = "none";
        }
        
        modal.style.display = "block";
    }

    // Close modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Show toast message - consolidated function
    function showToast(message) {
        console.log("Showing toast with message:", message); // Debug log
        const toast = document.getElementById('toast');
        if (!toast) {
            console.error('Toast element not found');
            return;
        }
        
        toast.textContent = message;
        toast.style.display = 'block'; // Ensure the toast is displayed
        toast.style.opacity = '1'; // Set opacity to 1 for visibility

         // Add a class to trigger CSS transitions
    toast.classList.add('show');
        
        setTimeout(() => {
            toast.style.opacity = '0'; // Fade out
            setTimeout(() => {
                toast.style.display = 'none'; // Hide after fade out
                toast.classList.remove('show');
            }, 300);
        }, 2000);
    }

    // Update the search functionality
    const thoughtsSearch = document.getElementById('thoughtsSearch');
    const clearSearch = document.getElementById('clearSearch');
    
    if (thoughtsSearch) {
        thoughtsSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const thoughts = document.querySelectorAll('#reflections li');
            const noResults = document.getElementById('noResults');
            let hasVisibleThoughts = false;
            
            thoughts.forEach(thought => {
                const categoryLabel = thought.querySelector('.category-label');
                if (categoryLabel) {
                    const categoryText = categoryLabel.textContent.toLowerCase();
                    
                    if (categoryText.includes(searchTerm)) {
                        thought.style.display = 'block'; // Show the thought if the category matches
                        hasVisibleThoughts = true;

                        // Highlight the matching text
                        const regex = new RegExp(`(${searchTerm})`, 'gi');
                        categoryLabel.innerHTML = categoryText.replace(regex, '<span class="highlight">$1</span>');
                    } else {
                        thought.style.display = 'none'; // Hide the thought if the category doesn't match
                        categoryLabel.innerHTML = categoryText; // Reset the label text
                    }
                }
            });

            // Show/hide no results message
            noResults.style.display = hasVisibleThoughts ? 'none' : 'block';

            // Show or hide the clear icon
            clearSearch.style.display = searchTerm ? 'block' : 'none';
        });

        // Clear the search input when the clear icon is clicked
        clearSearch.addEventListener('click', function() {
            thoughtsSearch.value = ''; // Clear the input
            clearSearch.style.display = 'none'; // Hide the clear icon
            thoughtsSearch.dispatchEvent(new Event('input')); // Trigger input event to refresh the list
        });
    }

    // Simplified copy to clipboard function
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy text');
            });
    }
;

