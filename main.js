import { products, displayProductList } from './products.js';
import { addToCart, showCart } from './cart.js';
import { showLogin, showRegister } from './auth.js';

const root = document.body;

function showHome() {
    root.innerHTML = `
        <header>
            <h1>Welcome to our E-Commerce Site</h1>
            <div id="product-list"></div>
            <button id="loginRegisterBtn">Login / Register</button>
            <button id="cartBtn">Voir le panier</button>
        </header>
    `;
    displayProductList(products);
    document.getElementById('loginRegisterBtn').onclick = () => showLogin(root, showHome, () => showRegister(root, showHome, () => showLogin(root, showHome, () => showRegister(root, showHome, showLogin))));
    document.getElementById('cartBtn').onclick = () => showCart(root, showHome);
}

document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
        alert('Produit ajouté au panier !');
    }
});

showHome();