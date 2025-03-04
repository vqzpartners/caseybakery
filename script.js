// Data structure to store users and their points
let users = [];
let adminPassword = "girasoles17"; // Default password

// Define the checkpoint thresholds
const checkpoints = [
    { level: 1, points: 100, label: "Starter" },
    { level: 2, points: 250, label: "Bronze" },
    { level: 3, points: 500, label: "Silver" },
    { level: 4, points: 750, label: "Gold" },
    { level: 5, points: 1000, label: "Platinum" },
    { level: 6, points: 1500, label: "Diamond" }
];

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage if available
    loadData();
    
    // Setup checkpoints
    setupCheckpoints();
    
    // Update user dropdown
    updateUserSelect();
    
    // Add event listeners
    document.getElementById('add-user-btn').addEventListener('click', addUser);
    document.getElementById('load-user-btn').addEventListener('click', loadUserData);
    document.getElementById('add-points-btn').addEventListener('click', addPoints);
    document.getElementById('change-password-btn').addEventListener('click', changePassword);
});

// Function to setup checkpoints
function setupCheckpoints() {
    const checkpointsContainer = document.getElementById('checkpoints');
    checkpointsContainer.innerHTML = '';
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    checkpointsContainer.appendChild(progressBar);
    
    // Create checkpoints
    checkpoints.forEach(checkpoint => {
        const checkpointDiv = document.createElement('div');
        checkpointDiv.className = 'checkpoint';
        checkpointDiv.id = `checkpoint-${checkpoint.level}`;
        
        const circle = document.createElement('div');
        circle.className = 'checkpoint-circle';
        circle.textContent = checkpoint.level;
        
        const label = document.createElement('div');
        label.className = 'checkpoint-label';
        label.innerHTML = `${checkpoint.label}<br>${checkpoint.points} pts`;
        
        checkpointDiv.appendChild(circle);
        checkpointDiv.appendChild(label);
        checkpointsContainer.appendChild(checkpointDiv);
    });
}

// Function to add a new user
function addUser() {
    const usernameInput = document.getElementById('username-input');
    const pointsInput = document.getElementById('points-input');
    
    let username = usernameInput.value.trim();
    const points = parseInt(pointsInput.value) || 0;
    
    // Ensure username starts with @
    if (!username.startsWith('@')) {
        username = '@' + username;
    }
    
    // Validate input
    if (username.length <= 1) {
        alert('Please enter a valid username');
        return;
    }
    
    // Check if user already exists
    const existingUserIndex = users.findIndex(user => user.username === username);
    
    if (existingUserIndex >= 0) {
        // Update existing user
        users[existingUserIndex].points = points;
        alert(`Updated user ${username} with ${points} points`);
    } else {
        // Add new user
        users.push({ username, points });
        alert(`Added new user ${username} with ${points} points`);
    }
    
    // Save data
    saveData();
    
    // Update dropdown
    updateUserSelect();
    
    // Clear inputs
    usernameInput.value = '';
    pointsInput.value = '';
}

// Function to update the user selection dropdown
function updateUserSelect() {
    const userSelect = document.getElementById('user-select');
    
    // Clear current options except the first
    while (userSelect.options.length > 1) {
        userSelect.remove(1);
    }
    
    // Add users to dropdown
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = `${user.username} (${user.points} pts)`;
        userSelect.appendChild(option);
    });
}

// Function to load a user's data
function loadUserData() {
    const userSelect = document.getElementById('user-select');
    const selectedUsername = userSelect.value;
    
    if (!selectedUsername) {
        alert('Please select a user');
        return;
    }
    
    const selectedUser = users.find(user => user.username === selectedUsername);
    
    if (selectedUser) {
        // Update UI with user data
        document.getElementById('selected-user').textContent = selectedUser.username;
        document.getElementById('user-points').textContent = `Points: ${selectedUser.points}`;
        
        // Update checkpoints visualization
        updateCheckpoints(selectedUser.points);
    }
}

// Function to add points to the current user with password verification
function addPoints() {
    const userDisplay = document.getElementById('selected-user');
    const pointsInput = document.getElementById('update-points');
    const passwordInput = document.getElementById('admin-password');
    const pointsToAdd = parseInt(pointsInput.value) || 0;
    const password = passwordInput.value;
    
    // Verify password
    if (password !== adminPassword) {
        alert('Incorrect admin password');
        passwordInput.value = '';
        return;
    }
    
    const selectedUsername = userDisplay.textContent;
    
    if (selectedUsername === 'No user selected') {
        alert('Please select a user first');
        return;
    }
    
    // Find user
    const userIndex = users.findIndex(user => user.username === selectedUsername);
    
    if (userIndex >= 0) {
        // Add points
        users[userIndex].points += pointsToAdd;
        
        // Update UI
        document.getElementById('user-points').textContent = `Points: ${users[userIndex].points}`;
        
        // Update checkpoints visualization
        updateCheckpoints(users[userIndex].points);
        
        // Update dropdown
        updateUserSelect();
        
        // Save data
        saveData();
        
        // Clear inputs
        pointsInput.value = '';
        passwordInput.value = '';
        
        alert(`Added ${pointsToAdd} points to ${selectedUsername}`);
    }
}

// Function to change the admin password
function changePassword() {
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    
    // Verify current password
    if (currentPassword !== adminPassword) {
        alert('Current password is incorrect');
        currentPasswordInput.value = '';
        return;
    }
    
    // Validate new password
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        return;
    }
    
    // Update password
    adminPassword = newPassword;
    
    // Save to localStorage
    localStorage.setItem('loyaltyAdminPassword', adminPassword);
    
    // Clear inputs
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    
    alert('Password changed successfully');
}

// Function to update checkpoints based on current points
function updateCheckpoints(currentPoints) {
    // Reset all checkpoints
    checkpoints.forEach(checkpoint => {
        const checkpointElement = document.getElementById(`checkpoint-${checkpoint.level}`);
        checkpointElement.classList.remove('completed', 'active');
    });
    
    // Find the current active checkpoint
    let activeCheckpoint = 0;
    let completedPoints = 0;
    
    for (let i = 0; i < checkpoints.length; i++) {
        const checkpoint = checkpoints[i];
        const checkpointElement = document.getElementById(`checkpoint-${checkpoint.level}`);
        
        if (currentPoints >= checkpoint.points) {
            checkpointElement.classList.add('completed');
            activeCheckpoint = i + 1;
            completedPoints = checkpoint.points;
        }
    }
    
    // Set the active checkpoint (next one to achieve)
    if (activeCheckpoint < checkpoints.length) {
        const nextCheckpoint = document.getElementById(`checkpoint-${checkpoints[activeCheckpoint].level}`);
        nextCheckpoint.classList.add('active');
    }
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const totalWidth = document.querySelector('.checkpoints').offsetWidth - 40; // Subtracting padding
    
    if (activeCheckpoint === 0) {
        // No checkpoints completed yet
        const progressPercent = currentPoints / checkpoints[0].points;
        const progressWidth = Math.min(progressPercent * (totalWidth / checkpoints.length), totalWidth / checkpoints.length);
        progressBar.style.width = `${progressWidth}px`;
    } else if (activeCheckpoint < checkpoints.length) {
        // Some checkpoints completed
        const lastCompletedPoints = checkpoints[activeCheckpoint - 1].points;
        const nextCheckpointPoints = checkpoints[activeCheckpoint].points;
        
        const baseWidth = (activeCheckpoint / checkpoints.length) * totalWidth;
        const sectionWidth = totalWidth / checkpoints.length;
        
        const progress = (currentPoints - lastCompletedPoints) / (nextCheckpointPoints - lastCompletedPoints);
        const additionalWidth = sectionWidth * progress;
        
        progressBar.style.width = `${baseWidth + additionalWidth}px`;
    } else {
        // All checkpoints completed
        progressBar.style.width = `${totalWidth}px`;
    }
}

// Function to save data to localStorage
function saveData() {
    localStorage.setItem('loyaltyUsers', JSON.stringify(users));
}

// Function to load data from localStorage
function loadData() {
    // Load users
    const savedData = localStorage.getItem('loyaltyUsers');
    if (savedData) {
        users = JSON.parse(savedData);
    }
    
    // Load admin password if it exists
    const savedPassword = localStorage.getItem('loyaltyAdminPassword');
    if (savedPassword) {
        adminPassword = savedPassword;
    }
}
