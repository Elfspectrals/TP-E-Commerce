import { products, displayProductList } from './products.js';
import { addToCart, showCart } from './cart.js';
import { showLogin, showRegister, logout } from './auth.js';

const root = document.body;

function showHome() {
    const user = localStorage.getItem('connectedUser');
    root.innerHTML = `
        <header>
            <h1>Welcome to our E-Commerce Site</h1>
            <div id="product-list"></div>
            <div style="margin:1em 0;">
                ${user ? `<span>Connecté en tant que <b>${user}</b></span> <button id="logoutBtn">Déconnexion</button>` : ''}
                <button id="loginRegisterBtn">${user ? 'Changer de compte' : 'Login / Register'}</button>
                <button id="cartBtn">Voir le panier</button>
            </div>
        </header>
    `;
    displayProductList(products);
    document.getElementById('loginRegisterBtn').onclick = () => {
        if (user) logout(showHome);
        else showLogin(root, showHome, () => showRegister(root, showHome, () => showLogin(root, showHome, () => showRegister(root, showHome, showLogin))));
    };
    if (user) {
        document.getElementById('logoutBtn').onclick = () => logout(showHome);
    }
    document.getElementById('cartBtn').onclick = () => showCart(root, showHome);
}

document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
        // Message d'ajout seulement si connecté
        if (localStorage.getItem('connectedUser')) {
            alert('Produit ajouté au panier !');
        }
    }
});

showHome();