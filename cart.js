import { products } from './products.js';

export function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}
export function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
export function addToCart(productId) {
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
export function showCart(root, showHome) {
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
            showCart(root, showHome);
        };
    });

    document.querySelectorAll('.cart-qty').forEach(input => {
        input.onchange = function() {
            const idx = parseInt(this.dataset.idx);
            const qty = parseInt(this.value);
            if (qty > 0) {
                cart[idx].quantity = qty;
                setCart(cart);
                showCart(root, showHome);
            }
        };
    });

    document.getElementById('promoForm').onsubmit = function(e) {
        e.preventDefault();
        const code = document.getElementById('promoInput').value.trim();
        if (code === 'ESGI10') {
            localStorage.setItem('promoCode', code);
            showCart(root, showHome);
        } else if (code.length > 0) {
            alert('Code promo invalide');
        }
    };
    document.getElementById('removePromoBtn').onclick = function() {
        localStorage.removeItem('promoCode');
        showCart(root, showHome);
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