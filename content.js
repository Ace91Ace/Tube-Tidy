function applySettings() {
  chrome.storage.local.get(
    ['homepageFeed', 'endSuggestions', 'sidebarSuggestions', 'comments', 'shorts'],
    (settings) => {
      // Hide homepage feed
      if (settings.homepageFeed) document.querySelector('#contents')?.setAttribute('hidden', true);

      // Hide video end suggestions
      if (settings.endSuggestions) hideEndSuggestions();

      // Hide sidebar suggestions
      if (settings.sidebarSuggestions) document.querySelector('#secondary')?.setAttribute('hidden', true);

      // Hide comments
      if (settings.comments) document.querySelector('#comments')?.setAttribute('hidden', true);

      // Handle Shorts as a normal video
      if (settings.shorts) {
        handleShortsRedirectAndDisableScrolling();
      }
    }
  );
}

// Function to hide video end suggestions
function hideEndSuggestions() {
  // Hide "Up next" and other related end suggestions
  const endScreen = document.querySelector('#related');
  if (endScreen) {
    endScreen.style.display = 'none';
  }

  // Dynamically monitor for any related end suggestions
  new MutationObserver(() => {
    const endScreenPopup = document.querySelector('#related');
    if (endScreenPopup) {
      endScreenPopup.style.display = 'none';
    }
  }).observe(document, { childList: true, subtree: true });
}

// Function to handle Shorts redirection and disabling scrolling
function handleShortsRedirectAndDisableScrolling() {
  // If we're on a Shorts video, redirect to the normal video page
  if (window.location.pathname.startsWith("/shorts/")) {
    redirectToNormalVideo();
  }

  // Observe changes in the URL (for when you switch between Shorts videos)
  const observer = new MutationObserver(() => {
    if (window.location.pathname.startsWith("/shorts/")) {
      redirectToNormalVideo();
    }
  });

  // Start observing for changes in the URL
  observer.observe(document.body, { childList: true, subtree: true });

  // Disable scrolling/swiping to the next video
  disableShortsSwiping();
}

// Redirect Shorts to normal video format
function redirectToNormalVideo() {
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/shorts/')) {
    const videoID = currentPath.split("/shorts/")[1];
    const newURL = `/watch?v=${videoID}`;
    console.log("Redirecting to: ", newURL);
    window.location.replace(newURL); // Redirect to the normal video format
  }
}

// Disable Shorts swiping to the next video by removing swipe elements
function disableShortsSwiping() {
  const reelContainer = document.querySelector('ytd-reel-player');

  if (reelContainer) {
    // Disable swipe interactions by making the element non-interactive
    reelContainer.style.pointerEvents = 'none';
    reelContainer.style.overflow = 'hidden';

    // Also, disable body scrolling to prevent the page from scrolling
    document.body.style.overflow = 'hidden';

    // Remove elements associated with the swipe navigation behavior
    const nextButton = document.querySelector('button[aria-label="Next"]');
    if (nextButton) {
      nextButton.style.display = 'none'; // Hide "Next" button
    }
  }
}

// Observe changes in the DOM and apply settings when necessary
new MutationObserver(applySettings).observe(document, { childList: true, subtree: true });
window.onload = applySettings;
