function applySettings() {
  chrome.storage.local.get(
    ['homepageFeed', 'endSuggestions', 'sidebarSuggestions', 'comments', 'shorts'],
    (settings) => {
      // Hide homepage feed
      if (settings.homepageFeed && window.location.pathname === "/") {
        document.querySelector('#contents')?.setAttribute('hidden', true);
      }

      // Hide video end suggestions
      if (settings.endSuggestions) {
        document.querySelector('#related')?.setAttribute('hidden', true);
      }

      // Hide sidebar suggestions
      if (settings.sidebarSuggestions) {
        document.querySelector('#secondary')?.setAttribute('hidden', true);
      }

      // Hide comments
      if (settings.comments) {
        document.querySelector('#comments')?.setAttribute('hidden', true);
      }

      // Handle Shorts as a normal video
      if (settings.shorts) {
        handleShortsRedirectAndDisableScrolling();
      }
    }
  );
}

// Function to handle Shorts redirection and disabling scrolling
function handleShortsRedirectAndDisableScrolling() {
  // If we're on a Shorts video, redirect to the normal video page
  if (window.location.pathname.startsWith("/shorts/")) {
    redirectToNormalVideo();
  }

  // Observe changes in the URL (for when you switch between shorts videos)
  const observer = new MutationObserver(() => {
    if (window.location.pathname.startsWith("/shorts/")) {
      redirectToNormalVideo();
    }
  });

  // Start observing for changes in the URL
  observer.observe(document, { childList: true, subtree: true });
  
  // Disable scrolling/swiping to the next video
  disableShortsSwiping();
}

// Redirect Shorts to normal video format
function redirectToNormalVideo() {
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/shorts/')) {
    const videoID = currentPath.split("/shorts/")[1];
    const newURL = `/watch?v=${videoID}`;
    window.location.replace(newURL); // Redirect to the normal video format
  }
}

// Disable Shorts swiping to the next video
function disableShortsSwiping() {
  // Find the element that holds the video
  const videoElement = document.querySelector('ytd-player');

  if (videoElement) {
    // Remove the style that allows swiping
    videoElement.style.overflow = 'hidden';

    // Remove elements related to video swiping
    const reelContainer = document.querySelector('ytd-reel-player');
    if (reelContainer) {
      reelContainer.style.pointerEvents = 'none';  // Disable interaction for swiping
    }

    // Disable scrolling behavior on the page
    document.body.style.overflow = 'hidden';
  }
}

new MutationObserver(applySettings).observe(document, { childList: true, subtree: true });
window.onload = applySettings;
