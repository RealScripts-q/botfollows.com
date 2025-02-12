// Developer Tools detection
const devtools = () => {
    let start = new Date();
    debugger;
    let end = new Date();
    if (end - start > 100) {
        alert('Developer tools detected. Access blocked.');
        document.body.style.display = "none"; // Hide body content
    }
}

// Call devtools function to check if dev tools are open
setInterval(devtools, 1000); // Repeated check every second

// List of 10 checks for the allowed URL with various spacing and variations
const allowedURLs = [
    "https://realscripts-q.github.io/botfollows.com/",
    "https://realscripts-q.github.io/botfollows .com/",
    "https://realscripts-q.github .io/botfollows.com/",
    "https://realscripts-q.github.io /botfollows.com/",
    "https://realscripts -q.github.io/botfollows.com/",
    "https://realscripts-q.github.io/botfollows .com/",
    "https://realscripts-q.github.io /botfollows .com/",
    "https://realscripts-q .github.io/botfollows.com/",
    "https://realscripts-q.github.io/botfollows. com/",
    "https:// realscripts-q.github.io/botfollows.com/"
];

// Function to check if the current URL is allowed
function isValidURL() {
    let currentURL = window.location.href.trim();
    return allowedURLs.some(url => currentURL === url);
}

// Check if the current URL is allowed
if (!isValidURL()) {
    alert("Access Blocked: Not a supported website");
    document.body.innerHTML = ""; // Clear the page content
    document.body.style.display = "none"; // Hide the body
}

// Block view source functionality for any URL that isn't the specified one
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey && event.key === 'u') || event.key === 'F12' || event.key === 'I') {
        if (!isValidURL()) {
            event.preventDefault();
            alert('Access Blocked: Not a supported website');
        }
    }
});

// Block right-click functionality
document.addEventListener('contextmenu', function(event) {
    if (!isValidURL()) {
        event.preventDefault();
        alert('Access Blocked: Not a supported website');
    }
});

let users = JSON.parse(localStorage.getItem("users")) || []; // Load saved users
let currentAdmin = null; // Track if the user is the admin

function validatePassword(password) {
    let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function signUp() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let adminCode = document.getElementById("adminCode").value.trim();
    let cookie = document.getElementById("cookieInput").value.trim();
    
    if (adminCode === "8rndosp") {
        currentAdmin = username === "realgysj"; // Only grant admin access to "realgysj"
        if (currentAdmin) {
            autoSignInAsRealgysj(); // Auto sign-in as realgysj if correct admin code
        } else {
            alert("Incorrect username for admin code.");
        }
        return;
    }

    if (!username || !password || !cookie) {
        alert("Please enter your username, password, and cookie.");
        return;
    }

    if (!validatePassword(password)) {
        alert("Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.");
        return;
    }

    // Save user information with the cookie they provided
    let newUser = {
        username: username,
        password: password,
        cookie: cookie
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users)); // Store in local storage

    alert("Account created successfully! Now enter your cookie to proceed.");

    // Hide signup form and show cookie input
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("cookieSection").style.display = "block";
}

function submitCookie() {
    let cookie = document.getElementById("cookieInput").value.trim();
    let validCookie = users.find(user => user.cookie === cookie);

    if (validCookie) {
        alert("Cookie accepted! Welcome back, " + validCookie.username);
        
        // Show admin logs if admin is logged in
        if (currentAdmin) {
            displayAdminLogs();
        }
    } else {
        alert("Invalid cookie.");
    }
}

function displayAdminLogs() {
    document.getElementById("adminLogs").style.display = "block";
    let logsDiv = document.getElementById("logs");
    logsDiv.innerHTML = ""; // Clear existing logs

    users.forEach(user => {
        let logEntry = document.createElement("div");
        logEntry.classList.add("cookie-log");
        logEntry.innerHTML = `
            <span>${user.username}</span>
            <button class="copy-btn" onclick="copyToClipboard('${user.cookie}')">Copy Cookie</button>
        `;
        logsDiv.appendChild(logEntry);
    });
}

function copyToClipboard(cookieValue) {
    navigator.clipboard.writeText(cookieValue)
        .then(() => alert("Cookie copied to clipboard!"))
        .catch(err => alert("Error copying cookie: " + err));
}

function autoSignInAsRealgysj() {
    alert("You are signed in as the admin 'realgysj'.");
    currentAdmin = true; // Treat "realgysj" as the admin
    displayAdminLogs(); // Display the admin logs automatically
}
