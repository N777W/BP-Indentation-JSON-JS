function resetPath() {
    currentPath = [];
    updateState();
    document.getElementById("feedback").textContent = "Path reset. Start over.";
}

function showHint() {
    document.getElementById("feedback").textContent = "Hint: Start with 'level1'.";
}
