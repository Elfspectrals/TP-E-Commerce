async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

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
    document.getElementById('loginForm').onsubmit = async function (e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem(username));
        if (user) {
            const hashed = await hashPassword(password);
            if (user.password === hashed) {
                localStorage.setItem('connectedUser', username);
                alert('Connexion réussie !');
                showHome();
                return;
            }
        }
        alert('Identifiants invalides !');
    };
    document.getElementById('showRegister').onclick = function (e) {
        e.preventDefault();
        showRegister();
    };
    document.getElementById('backHomeBtn').onclick = showHome;
}
export function showRegister(root, showHome, showLogin) {
    root.innerHTML = renderRegisterForm();
    document.getElementById('registerForm').onsubmit = async function (e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (localStorage.getItem(username)) {
            alert('Utilisateur déjà existant !');
        } else {
            const hashed = await hashPassword(password);
            localStorage.setItem(username, JSON.stringify({ username, password: hashed }));
            alert('Inscription réussie !');
            localStorage.setItem('connectedUser', username);
            showHome();
        }
    };
    document.getElementById('showLogin').onclick = function (e) {
        e.preventDefault();
        showLogin();
    };
    document.getElementById('backHomeBtn').onclick = showHome;
}
export function logout(showHome) {
    localStorage.removeItem('connectedUser');
    showHome();
}