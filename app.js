// --- Données produits (exemple) ---
const products = [
    { id: 1, name: "Produit 1", description: "Description 1", price: 10.99 },
    { id: 2, name: "Produit 2", description: "Description 2", price: 19.99 },
    { id: 3, name: "Produit 3", description: "Description 3", price: 5.99 },
    { id: 4, name: "Produit 4", description: "Description 4", price: 100 },
];

const root = document.body;

// --- Navigation ---
showHome();

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
    document.getElementById('loginRegisterBtn').onclick = showLogin;
    document.getElementById('cartBtn').onclick = showCart;
}

// --- Affichage produits ---
function displayProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Prix : ${product.price.toFixed(2)} €</p>
            <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        `;
        productList.appendChild(div);
    });
}

// --- Panier ---
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(productId) {
    let cart = getCart();
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    setCart(cart);
}
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
        alert('Produit ajouté au panier !');
    }
});

function showCart() {
    const cart = getCart();
    let total = 0;
    let promoCode = localStorage.getItem('promoCode') || '';
    let promoInput = promoCode ? `value="${promoCode}"` : '';
    let promoMessage = '';
    let discount = 0;

    let html = `
        <h2>Votre panier</h2>
        <table>
            <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Sous-total</th>
                <th>Actions</th>
            </tr>
    `;
    cart.forEach((item, idx) => {
        const subTotal = item.price * item.quantity;
        total += subTotal;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)} €</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" data-idx="${idx}" class="cart-qty">
                </td>
                <td>${subTotal.toFixed(2)} €</td>
                <td>
                    <button class="remove-cart-item" data-idx="${idx}">Supprimer</button>
                </td>
            </tr>
        `;
    });
    html += `</table>`;

    // Gestion des réductions
    if (total > 100) {
        discount += total * 0.10;
        promoMessage += `<p>10% de réduction appliquée (-${(total * 0.10).toFixed(2)} €)</p>`;
    }
    if (promoCode === 'ESGI10') {
        discount += 10;
        promoMessage += `<p>Code promo ESGI10 appliqué (-10.00 €)</p>`;
    }
    if (discount > total) discount = total; // Pas de total négatif

    html += `
        <form id="promoForm" style="margin:1em 0;">
            <label>Code promo : <input id="promoInput" ${promoInput}></label>
            <button type="submit">Appliquer</button>
            <button type="button" id="removePromoBtn">Retirer</button>
        </form>
        ${promoMessage}
        <h3>Total : ${(total - discount).toFixed(2)} €</h3>
        <button id="validateCartBtn">Valider le panier</button>
        <button id="backHomeBtn">Retour à l'accueil</button>
    `;
    root.innerHTML = html;

    document.querySelectorAll('.remove-cart-item').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(this.dataset.idx);
            cart.splice(idx, 1);
            setCart(cart);
            showCart();
        };
    });

    document.querySelectorAll('.cart-qty').forEach(input => {
        input.onchange = function() {
            const idx = parseInt(this.dataset.idx);
            const qty = parseInt(this.value);
            if (qty > 0) {
                cart[idx].quantity = qty;
                setCart(cart);
                showCart();
            }
        };
    });

    document.getElementById('promoForm').onsubmit = function(e) {
        e.preventDefault();
        const code = document.getElementById('promoInput').value.trim();
        if (code === 'ESGI10') {
            localStorage.setItem('promoCode', code);
            showCart();
        } else if (code.length > 0) {
            alert('Code promo invalide');
        }
    };
    document.getElementById('removePromoBtn').onclick = function() {
        localStorage.removeItem('promoCode');
        showCart();
    };

    document.getElementById('validateCartBtn').onclick = function() {
        setCart([]);
        localStorage.removeItem('promoCode');
        alert('Commande validée ! Merci pour votre achat.');
        showHome();
    };

    document.getElementById('backHomeBtn').onclick = function() {
        showHome();
    };
}

// --- Authentification ---
function renderLoginForm() {
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
function renderRegisterForm() {
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
function showLogin() {
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
function showRegister() {
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