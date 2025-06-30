// Returns the HTML for the login form
export function renderLoginForm() {
    return `
        <h2>Login</h2>
        <form id="loginForm">
            <input type="text" id="loginUsername" placeholder="Username" required><br>
            <input type="password" id="loginPassword" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
        <p>No account? <a href="#" id="showRegister">Register here</a></p>
    `;
}

// Returns the HTML for the register form
export function renderRegisterForm() {
    return `
        <h2>Register</h2>
        <form id="registerForm">
            <input type="text" id="registerUsername" placeholder="Username" required><br>
            <input type="password" id="registerPassword" placeholder="Password" required><br>
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="#" id="showLogin">Login here</a></p>
    `;
}