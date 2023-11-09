// pagination.js

// Function to display the data for a specific page
function displayItemsForPage(data, currentPage, itemsPerPage) {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const itemsToDisplay = data.slice(startIdx, endIdx);
  
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
  
    itemsToDisplay.forEach((item) => {
      // Append your item display logic here
      const tableRow = document.createElement('tr');
      // ... Create and append cells as needed for your table rows
      userTableBody.appendChild(tableRow);
    });
  }
  
  // Function to update pagination controls
  function updatePaginationControls(data, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
  }
  
  // Function to set up pagination buttons and functionality
  function setupPagination(data, itemsPerPage) {
    let currentPage = 1;
  
    const nextPageButton = document.getElementById('nextPageButton');
    const prevPageButton = document.getElementById('prevPageButton');
  
    nextPageButton.addEventListener('click', () => {
      if (currentPage < Math.ceil(data.length / itemsPerPage)) {
        currentPage++;
        displayItemsForPage(data, currentPage, itemsPerPage);
        updatePaginationControls(data, currentPage, itemsPerPage);
      }
    });
  
    prevPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayItemsForPage(data, currentPage, itemsPerPage);
        updatePaginationControls(data, currentPage, itemsPerPage);
      }
    });
  
    // Display initial page
    displayItemsForPage(data, currentPage, itemsPerPage);
    updatePaginationControls(data, currentPage, itemsPerPage);
  }
  
  // Example data - replace this with your actual data
  const exampleData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    // ... Add more data as needed
  ];
  
  // Execute pagination setup when the DOM is loaded
  window.addEventListener('DOMContentLoaded', () => {
    setupPagination(exampleData, 5); // Pass your data and items per page count
  });
  