class User {
    constructor(firstName, lastName, email, username, password, side) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
        this.side = side;
    }
}

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
            <input id="registerFirstName" placeholder="Prénom" required>
            <input id="registerLastName" placeholder="Nom" required>
            <input id="registerEmail" type="email" placeholder="Email" required>
            <input id="registerUsername" placeholder="Nom d'utilisateur" required>
            <input id="registerPassword" type="password" placeholder="Mot de passe" required>
            <input id="registerConfirmPassword" type="password" placeholder="Confirmer le mot de passe" required>
            <div class="side-choice">
                <label class="side-radio" for="side-jedi">
                    <input type="radio" id="side-jedi" name="side" value="jedi" required checked>
                    Jedi
                </label>
                <label class="side-radio" for="side-sith">
                    <input type="radio" id="side-sith" name="side" value="sith" required>
                    Sith
                </label>
            </div>
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
                // Ajout du style selon le côté
                document.body.classList.remove('jedi', 'sith');
                document.body.classList.add(user.side || 'jedi');
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
        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const email = document.getElementById('registerEmail').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const side = document.querySelector('input[name="side"]:checked').value;

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas !');
            return;
        }

        if (localStorage.getItem(username)) {
            alert('Utilisateur déjà existant !');
        } else {
            const hashed = await hashPassword(password);
            const user = new User(firstName, lastName, email, username, hashed, side);
            localStorage.setItem(username, JSON.stringify(user));
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

// Lors du logout, retirer la classe de style
export function logout(showHome) {
    localStorage.removeItem('connectedUser');
    document.body.classList.remove('jedi', 'sith');
    showHome();
}