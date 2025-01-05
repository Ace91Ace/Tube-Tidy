// Function to handle Shorts URL redirection and trigger page reload
function handleShortsRedirection() {
  if (window.location.pathname.startsWith('/shorts/')) {
    const videoId = window.location.pathname.split('/')[2]; // Extract video ID
    if (videoId) {
      // Redirect to regular video URL
      const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.replace(newUrl); // Redirect to the new URL

      // Reload the page after redirection
      window.location.reload(); // Reload page to apply the new URL
    }
  }
}

// Function to hide homepage feed based on user preference
function hideHomepageFeed(isEnabled) {
  if (isEnabled && window.location.pathname === '/') {
    document.getElementById('primary').style.display = 'none';
  } else {
    document.getElementById('primary').style.display = 'block';
  }
}

// Function to hide video end suggestions
function hideEndSuggestions(isEnabled) {
  const endScreen = document.querySelector('.ytp-ce-element');
  if (endScreen) {
    endScreen.style.display = isEnabled ? 'none' : 'block';
  }
}

// Function to hide sidebar suggestions
function hideSidebarSuggestions(isEnabled) {
  const sidebar = document.getElementById('secondary');
  if (sidebar) {
    sidebar.style.display = isEnabled ? 'none' : 'block';
  }
}

// Function to hide comments
function hideComments(isEnabled) {
  const commentsSection = document.getElementById('comments');
  if (commentsSection) {
    commentsSection.style.display = isEnabled ? 'none' : 'block';
  }
}

// Load settings from storage
chrome.storage.local.get(
  ['homepageFeed', 'endSuggestions', 'sidebarSuggestions', 'comments', 'shorts'],
  (result) => {
    hideHomepageFeed(result.homepageFeed || false);
    hideEndSuggestions(result.endSuggestions || false);
    hideSidebarSuggestions(result.sidebarSuggestions || false);
    hideComments(result.comments || false);

    // Apply Shorts redirection if necessary
    if (result.shorts) {
      handleShortsRedirection();
    }

    // Watch for URL changes and reapply the changes dynamically
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        if (result.shorts && currentUrl.includes('/shorts/')) {
          handleShortsRedirection(); // Apply redirection and reload on URL change
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
);
