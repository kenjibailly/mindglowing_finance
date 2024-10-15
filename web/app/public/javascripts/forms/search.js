document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    if (!searchInput) {
      return;
    }
    const searchResults = document.querySelector('.searchResultsPopup');
  
    // Function to show the search results popup
    const showSearchResults = async () => {
      const searchTerm = searchInput.value;
  
      // Fetch the search results using AJAX
      const response = await fetch(`/search?q=${encodeURIComponent(searchTerm)}`);
      const html = await response.text();
  
      // Update the search results popup
      searchResults.innerHTML = html;
      searchResults.classList.remove('hidden');
    };
  
    // Event listener for input changes
    searchInput.addEventListener('input', function () {
        showSearchResults();
    });
  
    // Event listener for Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        searchResults.classList.add('hidden');
      }
    });
  
    // Event listener to hide the search results popup when clicking outside of it
    document.addEventListener('click', function (event) {
      if (!searchResults.contains(event.target) && event.target !== searchInput) {
        searchResults.classList.add('hidden');
      }
    });
  });
  