function paginateArray(array, itemsPerPage, currentPage, reverse) {
    let reversedArray;
    if (reverse) {
      // Reverse the array
      reversedArray = array.slice().reverse();
    }
  
    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let pageItems;

    if (reverse) {
      // Extract the items for the current page
      pageItems = reversedArray.slice(startIndex, endIndex);
    } else {
      // Extract the items for the current page
      pageItems = array.slice(startIndex, endIndex);
    }
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(array.length / itemsPerPage);
  
    return {
      pageItems,
      currentPage,
      totalPages,
    };
  }
  
  // Export the paginateArray function for use in other files
  module.exports = paginateArray;