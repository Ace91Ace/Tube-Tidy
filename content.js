function applySettings() {
  chrome.storage.local.get(
    ['homepageFeed', 'endSuggestions', 'sidebarSuggestions', 'comments', 'shorts'],
    (settings) => {
      // Hide homepage feed
      if (settings.homepageFeed) document.querySelector('#contents')?.setAttribute('hidden', true);

      // Hide video end suggestions
      if (settings.endSuggestions) document.querySelector('#related')?.setAttribute('hidden', true);

      // Hide sidebar suggestions
      if (settings.sidebarSuggestions) document.querySelector('#secondary')?.setAttribute('hidden', true);

      // Hide comments
      if (settings.comments) document.querySelector('#comments')?.setAttribute('hidden', true);

      // Shorts as regular video
      if (settings.shorts) {
        document.querySelectorAll('ytd-reel-video-renderer').forEach((shorts) => {
          shorts.style.overflow = 'hidden';
          shorts.style.height = 'auto';
          shorts.style.scrollBehavior = 'unset';
        });
      }
    }
  );
}

new MutationObserver(applySettings).observe(document, { childList: true, subtree: true });
window.onload = applySettings;
