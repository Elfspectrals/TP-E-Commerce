import { products, saveStocks } from './products.js';

class Cart {
    constructor(userId) {
        this.userId = userId;
    }

    getItems() {
        if (!this.userId) return [];
        return JSON.parse(localStorage.getItem(`cart_${this.userId}`)) || [];
    }

    saveItems(items) {
        if (!this.userId) return;
        localStorage.setItem(`cart_${this.userId}`, JSON.stringify(items));
    }
}

export function getCart() {
    const user = localStorage.getItem('connectedUser');
    if (!user) return [];
    const cart = new Cart(user);
    return cart.getItems();
}

export function setCart(cartItems) {
    const user = localStorage.getItem('connectedUser');
    if (!user) return;
    const cart = new Cart(user);
    cart.saveItems(cartItems);
}

export function addToCart(productId, quantity = 1) {
    const user = localStorage.getItem('connectedUser');
    if (!user) {
        alert("Vous devez être connecté pour ajouter au panier.");
        return;
    }

    let cart = getCart();
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);

    // Vérification stock
    const totalQuantity = item ? item.quantity + quantity : quantity;
    if (totalQuantity > product.stock) {
        alert(`Stock insuffisant ! Maximum: ${product.stock}`);
        return;
    }

    if (item) {
        item.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }
    setCart(cart);
}

export function showCart(root, showHome) {
    const connectedUser = localStorage.getItem('connectedUser');
    if (!connectedUser) {
        root.innerHTML = `
            <h2>Vous devez être connecté pour accéder au panier.</h2>
            <button id="backHomeBtn">Retour à l'accueil</button>
        `;
        document.getElementById('backHomeBtn').onclick = function () {
            showHome();
        };
        return;
    }
    const cart = getCart();
    let total = 0;
    let promoCode = localStorage.getItem(`promoCode_${connectedUser}`) || '';
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
                <th>Image</th>
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
                <td><img src="${item.image}" alt="${item.name}" style="width:100px;height:auto;"></td>
                <td>
                    <button class="remove-cart-item" data-idx="${idx}">Supprimer</button>
                </td>
            </tr>
        `;
    });
    html += `</table>`;

    // Réductions
    if (total > 100) {
        discount += total * 0.10;
        promoMessage += `<p>10% de réduction appliquée (-${(total * 0.10).toFixed(2)} €)</p>`;
    }
    if (promoCode === 'ESGI10') {
        discount += 10;
        promoMessage += `<p>Code promo ESGI10 appliqué (-10.00 €)</p>`;
    }
    if (discount > total) discount = total;

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
        btn.onclick = function () {
            const idx = parseInt(this.dataset.idx);
            cart.splice(idx, 1);
            setCart(cart);
            showCart(root, showHome);
        };
    });

    document.querySelectorAll('.cart-qty').forEach(input => {
        input.onchange = function () {
            const idx = parseInt(this.dataset.idx);
            const qty = parseInt(this.value);
            const item = cart[idx];
            const product = products.find(p => p.id === item.id);

            if (qty > 0 && qty <= product.stock) {
                cart[idx].quantity = qty;
                setCart(cart);
                showCart(root, showHome);
            } else {
                alert(`Quantité invalide ! Maximum: ${product.stock}`);
                this.value = item.quantity;
            }
        };
    });

    document.getElementById('promoForm').onsubmit = function (e) {
        e.preventDefault();
        const code = document.getElementById('promoInput').value.trim();
        if (code === 'ESGI10') {
            localStorage.setItem(`promoCode_${connectedUser}`, code);
            showCart(root, showHome);
        } else if (code.length > 0) {
            alert('Code promo invalide');
        }
    };
    document.getElementById('removePromoBtn').onclick = function () {
        localStorage.removeItem(`promoCode_${connectedUser}`);
        showCart(root, showHome);
    };

    document.getElementById('validateCartBtn').onclick = function () {
        // Mise à jour des stocks
        cart.forEach(item => {
            const productIndex = products.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
                products[productIndex].stock -= item.quantity;
            }
        });

        // Sauvegarder les nouveaux stocks
        saveStocks();

        setCart([]);
        localStorage.removeItem(`promoCode_${connectedUser}`);
        alert('Commande validée ! Merci pour votre achat.');
        showHome();
    };

    document.getElementById('backHomeBtn').onclick = function () {
        showHome();
    };
}