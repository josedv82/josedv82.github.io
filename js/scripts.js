document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("modal");
    var modalText = document.getElementById("modal-text");
    var modalIllustration = document.getElementById("modal-illustration");
    var copyIcon = document.getElementById("copy-icon");
    var twitterIcon = document.getElementById("twitter-icon");
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
        checkAndAppendIcon(item);

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

        var timer;
        item.addEventListener('mousedown', function () {
            timer = setTimeout(function () {
                openModal(item);
            }, 1000); // 1000ms for long press
        });

        item.addEventListener('mouseup', function () {
            clearTimeout(timer);
        });

        item.addEventListener('mouseout', function () {
            clearTimeout(timer);
        });
    });

    function openModal(item) {
        // Remove the icon temporarily to avoid copying it to the modal text
        var icon = item.querySelector('.text-icon');
        if (icon) {
            icon.style.display = 'none';
        }
        modalText.innerText = item.innerText; // Use innerText to avoid copying HTML tags
        
        if (icon) {
            icon.style.display = 'inline';
        }

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

    // Copy to clipboard functionality
    copyIcon.onclick = function() {
        var textToCopy = modalText.innerText;
        navigator.clipboard.writeText(textToCopy).then(function() {
            showToast('Text copied to clipboard');
            copyIcon.classList.add('clicked');
        }).catch(function(err) {
            showToast('Failed to copy text');
        });
    }

    // Twitter share functionality
    twitterIcon.onclick = function() {
        var textToShare = modalText.innerText + ' @jfernadez__';
        var twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
        window.open(twitterUrl, '_blank');
    }

    // Show toast message
    function showToast(message) {
        toast.innerText = message;
        toast.className = "toast show";
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
    }
});
