export function renderLoginForm() {
    return `
        <h2>Connexion</h2>
        <form id="loginForm">
            <input id="loginUsername" placeholder="Nom d'utilisateur" required>
            <input id="loginPassword" type="password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <p>Pas de compte ? <a href="#" id="showRegister">Créer un compte</a></p>
        <button id="backHomeBtn">Retour à l'accueil</button>
    `;
}
export function renderRegisterForm() {
    return `
        <h2>Inscription</h2>
        <form id="registerForm">
            <input id="registerUsername" placeholder="Nom d'utilisateur" required>
            <input id="registerPassword" type="password" placeholder="Mot de passe" required>
            <button type="submit">S'inscrire</button>
        </form>
        <p>Déjà un compte ? <a href="#" id="showLogin">Se connecter</a></p>
        <button id="backHomeBtn">Retour à l'accueil</button>
    `;
}
export function showLogin(root, showHome, showRegister) {
    root.innerHTML = renderLoginForm();
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            alert('Connexion réussie !');
            showHome();
        } else {
            alert('Identifiants invalides !');
        }
    };
    document.getElementById('showRegister').onclick = function(e) {
        e.preventDefault();
        showRegister();
    };
    document.getElementById('backHomeBtn').onclick = showHome;
}
export function showRegister(root, showHome, showLogin) {
    root.innerHTML = renderRegisterForm();
    document.getElementById('registerForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (localStorage.getItem(username)) {
            alert('Utilisateur déjà existant !');
        } else {
            localStorage.setItem(username, JSON.stringify({ username, password }));
            alert('Inscription réussie !');
            showLogin();
        }
    };
    document.getElementById('showLogin').onclick = function(e) {
        e.preventDefault();
        showLogin();
    };
    document.getElementById('backHomeBtn').onclick = showHome;
}