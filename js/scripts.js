document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("modal");
    var span = document.getElementsByClassName("close")[0];
    var modalText = document.getElementById("modal-text");

    // Close modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = "none";
    }

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
});
