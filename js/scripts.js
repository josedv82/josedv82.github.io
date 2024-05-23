document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("modal");
    var modalText = document.getElementById("modal-text");
    var copyIcon = document.getElementById("copy-icon");
    var twitterIcon = document.getElementById("twitter-icon");
    var toast = document.getElementById("toast");


    // Close modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    var timer;

    document.querySelectorAll('ul#reflections li').forEach(function (item) {
        item.addEventListener('mousedown', function () {
            timer = setTimeout(function () {
                modalText.innerHTML = item.innerHTML;
                modal.style.display = "block";
            }, 1000); // 1000ms for long press
        });

        item.addEventListener('mouseup', function () {
            clearTimeout(timer);
        });

        item.addEventListener('mouseout', function () {
            clearTimeout(timer);
        });
    });

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

