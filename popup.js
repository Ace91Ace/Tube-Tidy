// Toggle Dark Mode
document.getElementById('dark-mode').addEventListener('change', (event) => {
  const theme = event.target.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  chrome.storage.local.set({ theme });
});

// Load preferences and apply settings
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    ['homepageFeed', 'endSuggestions', 'sidebarSuggestions', 'comments', 'shorts', 'theme'],
    (result) => {
      document.getElementById('homepage-feed').checked = result.homepageFeed || false;
      document.getElementById('end-suggestions').checked = result.endSuggestions || false;
      document.getElementById('sidebar-suggestions').checked = result.sidebarSuggestions || false;
      document.getElementById('comments').checked = result.comments || false;
      document.getElementById('shorts').checked = result.shorts || false;
      document.getElementById('dark-mode').checked = result.theme === 'dark';

      if (result.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  );

  // Save settings when toggles are changed
  document.querySelectorAll('.switch input').forEach((input) => {
    input.addEventListener('change', () => {
      const settings = {
        homepageFeed: document.getElementById('homepage-feed').checked,
        endSuggestions: document.getElementById('end-suggestions').checked,
        sidebarSuggestions: document.getElementById('sidebar-suggestions').checked,
        comments: document.getElementById('comments').checked,
        shorts: document.getElementById('shorts').checked,
      };

      chrome.storage.local.set(settings);
    });
  });
});
