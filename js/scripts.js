/* ------------------------------------------------------------
   scripts.js
   ------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const modalIllustration = document.getElementById("modal-illustration");
  const toast = document.getElementById("toast");

  // 1. Check if an image exists at a URL
  function imageExists(imageUrl, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = imageUrl;
  }

  // 2. Assign pencil icon if illustration for reflection exists
  function checkAndAppendIcon(item) {
    const illustrationUrl = `illustrations/${item.id}.png`;
    imageExists(illustrationUrl, function (exists) {
      if (exists) {
        const icon = document.createElement("i");
        icon.className = "fas fa-pencil text-icon";
        icon.style.display = "none";
        icon.addEventListener("click", function () {
          openModal(item);
        });
        item.appendChild(icon);
        item.setAttribute("data-illustration", "true");
      } else {
        item.setAttribute("data-illustration", "false");
      }
    });
  }

  // 3. Open Modal
  function openModal(item) {
    const categoryLabel = item.querySelector(".category-label").innerText;
    const textWithoutLabel = item.innerText.replace(categoryLabel, "").trim();

    modalText.innerText = textWithoutLabel;

    const illustrationUrl = `illustrations/${item.id}.png`;
    if (item.getAttribute("data-illustration") === "true") {
      imageExists(illustrationUrl, function (exists) {
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

  // 4. Close Modal when user clicks outside the modal content
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // 5. Show Toast
  function showToast(message) {
    if (!toast) {
      console.error("Toast element not found");
      return;
    }
    toast.textContent = message;
    toast.style.display = "block";
    toast.style.opacity = "1";
    toast.classList.add("show");

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.style.display = "none";
        toast.classList.remove("show");
      }, 300);
    }, 2000);
  }

  // 6. Copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        showToast("Failed to copy text");
      });
  }

  // 7. Setup each reflection item
  const reflectionItems = document.querySelectorAll(".reflections-list li");
  reflectionItems.forEach((item) => {
    // Insert category label
    const category = item.getAttribute("data-category");
    const labelSpan = document.createElement("span");
    labelSpan.className = "category-label";
    labelSpan.textContent = category;
    item.insertBefore(labelSpan, item.firstChild);

    // Check if there's an illustration
    checkAndAppendIcon(item);

    // Card actions
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "card-actions";

    // Copy icon
    const copyButton = document.createElement("i");
    copyButton.className = "fas fa-copy card-action-icon";
    copyButton.title = "Copy to clipboard";
    copyButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const textWithoutLabel = item.innerText
        .replace(item.querySelector(".category-label").innerText, "")
        .trim();
      copyToClipboard(textWithoutLabel);
    });

    // Twitter icon
    const tweetButton = document.createElement("i");
    tweetButton.className = "fab fa-twitter card-action-icon";
    tweetButton.title = "Share on Twitter";
    tweetButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const textWithoutLabel = item.innerText
        .replace(item.querySelector(".category-label").innerText, "")
        .trim();
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        textWithoutLabel
      )}`;
      window.open(twitterUrl, "_blank");
    });

    // Bluesky icon
    const blueskyButton = document.createElement("i");
    blueskyButton.className = "fas fa-feather card-action-icon";
    blueskyButton.title = "Share on Bluesky";
    blueskyButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const textWithoutLabel = item.innerText
        .replace(item.querySelector(".category-label").innerText, "")
        .trim();
      const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(
        textWithoutLabel
      )}`;
      window.open(blueskyUrl, "_blank");
    });

    // Share toggle button
    const shareButton = document.createElement("i");
    shareButton.className = "fa-solid fa-angle-right card-action-icon share-toggle";

    // Share options container
    const shareOptionsDiv = document.createElement("div");
    shareOptionsDiv.className = "share-options";

    // Toggle display of share options
    shareButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = shareOptionsDiv.style.display === "flex";
      shareOptionsDiv.style.display = isVisible ? "none" : "flex";
      shareButton.className = isVisible
        ? "fa-solid fa-angle-right card-action-icon share-toggle"
        : "fa-solid fa-circle-xmark card-action-icon share-toggle";
    });

    // Append icons to shareOptionsDiv
    shareOptionsDiv.appendChild(copyButton);
    shareOptionsDiv.appendChild(tweetButton);
    shareOptionsDiv.appendChild(blueskyButton);

    // Add share button + share options to card actions
    actionsDiv.appendChild(shareButton);
    actionsDiv.appendChild(shareOptionsDiv);

    // Append actions to item
    item.appendChild(actionsDiv);

    // Pencil icon hover
    item.addEventListener("mouseenter", function () {
      if (item.getAttribute("data-illustration") === "true") {
        item.querySelector(".text-icon").style.display = "inline";
      }
    });
    item.addEventListener("mouseleave", function () {
      if (item.getAttribute("data-illustration") === "true") {
        item.querySelector(".text-icon").style.display = "none";
      }
    });
  });

  // 8. Search filter
  const thoughtsSearch = document.getElementById("thoughtsSearch");
  const clearSearch = document.getElementById("clearSearch");
  const noResults = document.getElementById("noResults");

  if (thoughtsSearch) {
    thoughtsSearch.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      let hasVisibleItems = false;

      reflectionItems.forEach((thought) => {
        const label = thought.querySelector(".category-label");
        if (label) {
          const originalText = label.textContent;
          const labelText = originalText.toLowerCase();

          if (labelText.includes(searchTerm)) {
            thought.style.display = "block";
            hasVisibleItems = true;

            // Highlight matched text
            const regex = new RegExp(`(${searchTerm})`, "gi");
            label.innerHTML = originalText.replace(
              regex,
              `<span class="highlight">$1</span>`
            );
          } else {
            thought.style.display = "none";
            label.innerHTML = originalText;
          }
        }
      });

      noResults.style.display = hasVisibleItems ? "none" : "block";
      clearSearch.style.display = searchTerm ? "block" : "none";
    });

    // Clear search
    clearSearch.addEventListener("click", function () {
      thoughtsSearch.value = "";
      clearSearch.style.display = "none";
      thoughtsSearch.dispatchEvent(new Event("input"));
    });
  }
});

