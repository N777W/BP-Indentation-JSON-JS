// Utility functions for JSON path-finding experiment

// Function to dynamically create navigation buttons for available paths
function createNavigationButtons(currentObject) {
    const stageElement = document.getElementById('STAGE');
    stageElement.innerHTML = '';  // Clear previous buttons

    // Generate buttons for each key in the current object level
    Object.keys(currentObject).forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.onclick = () => navigateToPath(key);
        stageElement.appendChild(button);
    });

    // Add a 'Go Back' button if not at root
    if (currentPath.length > 0) {
        const backButton = document.createElement('button');
        backButton.textContent = 'Go Back';
        backButton.onclick = goBack;
        stageElement.appendChild(backButton);
    }
}

// Call this function to update buttons based on the current path level
function updateNavigation() {
    const currentObject = currentPath.reduce((obj, key) => obj && obj[key], jsonData) || jsonData;
    createNavigationButtons(currentObject);
}
