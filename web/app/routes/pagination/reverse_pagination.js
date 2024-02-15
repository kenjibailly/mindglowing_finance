function reversePaginateArray(array, itemsPerPage, currentPage) {
    // Reverse the array
    const reversedArray = array.slice().reverse();
  
    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    // Extract the items for the current page
    const pageItems = reversedArray.slice(startIndex, endIndex);
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(array.length / itemsPerPage);
  
    return {
      pageItems,
      currentPage,
      totalPages,
    };
  }
  
  // Export the paginateArray function for use in other files
  module.exports = reversePaginateArray;