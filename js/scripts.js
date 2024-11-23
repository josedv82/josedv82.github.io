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
    document.querySelectorAll('ul#reflections li').forEach(function (item) {
        const categoryLabel = document.createElement('span');
        categoryLabel.className = 'category-label';
        
        const text = item.innerText.toLowerCase();
        let category = '';
        
        // Consolidated into 6 main categories
        if (text.includes('data') || text.includes('monitoring') || text.includes('analytics') || text.includes('metrics') || 
            text.includes('science') || text.includes('research') || text.includes('study')) {
            category = 'Science & Data';
        } else if (text.includes('leadership') || text.includes('management') || text.includes('direction') || 
                   text.includes('team') || text.includes('culture') || text.includes('organization')) {
            category = 'Leadership';
        } else if (text.includes('performance') || text.includes('training') || text.includes('strength') || 
                   text.includes('practice') || text.includes('athlete') || text.includes('coach') || 
                   text.includes('coaching')) {
            category = 'Performance';
        } else if (text.includes('career') || text.includes('job') || text.includes('hiring') || 
                   text.includes('interview') || text.includes('experience') || text.includes('growth')) {
            category = 'Career Growth';
        } else if (text.includes('innovation') || text.includes('technology') || text.includes('solution') || 
                   text.includes('strategy') || text.includes('planning') || text.includes('system')) {
            category = 'Innovation';
        } else {
            category = 'Philosophy'; // Default category for general insights and philosophical thoughts
        }
        
        categoryLabel.textContent = category;
        item.insertBefore(categoryLabel, item.firstChild);

        checkAndAppendIcon(item);

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

    // Show toast message
    function showToast(message) {
        toast.innerText = message;
        toast.className = "toast show";
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
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

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show toast
            const toast = document.getElementById('toast');
            toast.textContent = 'Text copied to clipboard!';
            toast.classList.add('show');
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Add click handlers to all reflection list items
    const reflections = document.querySelectorAll('#reflections li');
    reflections.forEach(reflection => {
        reflection.addEventListener('click', function() {
            const text = this.textContent;
            
            // Visual feedback on the clicked item
            this.classList.add('highlight');
            setTimeout(() => {
                this.classList.remove('highlight');
            }, 200);

            // Copy text
            navigator.clipboard.writeText(text)
                .then(() => {
                    const toast = document.getElementById('toast');
                    toast.textContent = 'Copied to clipboard!';
                    toast.style.display = 'block';
                    toast.style.opacity = '1';
                    
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            toast.style.display = 'none';
                        }, 300);
                    }, 2000);
                })
                .catch(err => console.error('Failed to copy:', err));
        });
    });
});

function copyToClipboard(text) {
    // Log for debugging
    console.log('Copying text:', text);
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('Text copied to clipboard!');
            console.log('Text copied successfully');
        })
        .catch(err => {
            showToast('Failed to copy text');
            console.error('Failed to copy text:', err);
        });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    // Log for debugging
    console.log('Toast element:', toast);
    
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
