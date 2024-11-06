const wordPool = [
    "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa",
    "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi",
    "chi", "psi", "omega", "apple", "banana", "carrot", "date", "fig", "grape", "honeydew",
    "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry",
    "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yam", "zucchini"
];

let currentJSON = {};
let correctPath = "";  // Full path including the attribute itself
let targetAttribute = "Target value!";
let currentPath = [];
let uniqueKeys = new Set();  // Track all unique keys in the JSON
let testCaseCount = 30;  // Adjust the number of test cases if needed
let currentTestCase = 0;
let isIndented = true;  // Tracks whether the current test case is indented or not

// Generate a random JSON object with guaranteed depth and complexity
function generateRandomJSON(maxDepth = 3, maxFields = 3) {
    const jsonObject = {};
    uniqueKeys.clear();  // Reset the unique keys set for each test case
    let possiblePaths = [];

    function addNestedObject(obj, currentDepth, path) {
        if (currentDepth > maxDepth) return;

        const numFields = Math.min(maxFields, wordPool.length - uniqueKeys.size);
        let addedFields = 0;

        while (addedFields < numFields) {
            const key = getRandomKey(uniqueKeys);
            uniqueKeys.add(key);
            addedFields++;

            if (currentDepth < maxDepth && Math.random() > 0.3) {
                // Add nested JSONObject
                obj[key] = {};
                addNestedObject(obj[key], currentDepth + 1, [...path, key]);
            } else {
                // Assign a value and add to possible paths
                obj[key] = getRandomValue(uniqueKeys);
                possiblePaths.push([...path, key]);
            }
        }
    }

    addNestedObject(jsonObject, 1, []);
    setRandomTargetAttribute(jsonObject, possiblePaths);
    return jsonObject;
}

// Set a random attribute as the target and update correctPath to include the attribute itself
function setRandomTargetAttribute(jsonObject, possiblePaths) {
    if (possiblePaths.length > 0) {
        const randomPath = possiblePaths[Math.floor(Math.random() * possiblePaths.length)];
        correctPath = randomPath.join(".");  // Include the final attribute key in correctPath

        // Log for debugging
        console.log("Setting Full Correct Path:", correctPath);

        // Traverse to set target value
        let current = jsonObject;
        for (let i = 0; i < randomPath.length - 1; i++) {
            current = current[randomPath[i]];
        }
        current[randomPath[randomPath.length - 1]] = targetAttribute;
    } else {
        console.error("Error: No valid paths found to set as correct path.");
    }
}

// Get a random key from the word pool, avoiding used keys
function getRandomKey(usedKeys) {
    let key;
    do {
        key = wordPool[Math.floor(Math.random() * wordPool.length)];
    } while (usedKeys.has(key));
    return key;
}

// Get a random value from the word pool, avoiding used values
function getRandomValue(usedKeys) {
    let value;
    do {
        value = wordPool[Math.floor(Math.random() * wordPool.length)];
    } while (usedKeys.has(value));
    return value;
}

// Display the JSON object, either indented or in a vertical format with no indentation
function displayJSON() {
    const jsonDisplay = document.getElementById("jsonDisplay");

    if (isIndented) {
        // Display in hierarchical indented format
        jsonDisplay.innerHTML = highlightTargetValue(JSON.stringify(currentJSON, null, 4));
    } else {
        // Display in vertical format without indentation
        jsonDisplay.innerHTML = highlightTargetValue(formatJSONVertical(currentJSON));
    }
}

// Helper function to wrap the target value in a red-colored span
function highlightTargetValue(jsonString) {
    // Replace the target value text with a span styled in red
    const targetValueRegex = new RegExp(`"${targetAttribute}"`, 'g');
    return jsonString.replace(targetValueRegex, `<span style="color: red;">"${targetAttribute}"</span>`);
}

// Convert JSON object to a vertical format with each key-value pair on a new line
function formatJSONVertical(obj) {
    const lines = JSON.stringify(obj, null, 4).split('\n');  // Format with indentation, then remove spaces
    return lines.map(line => line.trim()).join('\n');
}

// Display all unique keys as alphabetically sorted buttons for path building
function displayKeyButtons() {
    const keyButtons = document.getElementById("keyButtons");
    keyButtons.innerHTML = "";  // Clear previous buttons

    // Sort the unique keys alphabetically and then create buttons
    Array.from(uniqueKeys).sort().forEach(key => {
        const button = document.createElement("button");
        button.textContent = key;
        button.onclick = () => addToPath(key);
        keyButtons.appendChild(button);
    });
}

// Add a key to the current path and update the path display
function addToPath(key) {
    currentPath.push(key);
    updatePathDisplay();
}

// Update the displayed path in the input field
function updatePathDisplay() {
    document.getElementById("inputPath").value = currentPath.join(".");
}

// Clear the current path
function clearPath() {
    currentPath = [];
    updatePathDisplay();
}

// Synchronize `currentPath` with the manual input in the text field
function syncPathFromInput() {
    const input = document.getElementById("inputPath").value.trim();
    currentPath = input ? input.split(".") : [];
}

// Check if the entered path matches the target path including the attribute itself
function checkPath() {
    const inputPath = document.getElementById("inputPath").value.trim();
    const feedback = document.getElementById("feedback");

    console.log("User Entered Path:", inputPath);
    console.log("Full Correct Path for Comparison:", correctPath);

    if (inputPath === correctPath) {
        feedback.textContent = "Correct! Moving to the next test case...";
        feedback.style.color = "green";
        setTimeout(nextTestCase, 1000);  // Wait for a second before moving to the next case
    } else {
        feedback.textContent = "Incorrect path. Try again!";
        feedback.style.color = "red";
    }
}

// Start a new test case, randomly alternating between indented and unindented
function startTestCase() {
    currentJSON = generateRandomJSON();
    currentPath = [];
    isIndented = Math.random() > 0.5;  // Randomly choose indented or unindented format for each test case
    displayJSON();
    displayKeyButtons();
    updatePathDisplay();
    document.getElementById("feedback").textContent = `Test Case ${currentTestCase + 1} of ${testCaseCount}`;
    document.getElementById("feedback").style.color = "black";
}

// Move to the next test case
function nextTestCase() {
    if (currentTestCase < testCaseCount - 1) {
        currentTestCase++;
        startTestCase();
    } else {
        displayResults();
    }
}

// Display results at the end of the experiment
function displayResults() {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "<h3>Experiment Complete</h3><p>Thank you for participating!</p>";
}

// Initialize the experiment
window.onload = () => {
    document.getElementById("resultsContainer").innerHTML = "";
    startTestCase();
};
