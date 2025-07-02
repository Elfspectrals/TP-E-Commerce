class Product {
    constructor(id, name, description, price, stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock; 
    }
}

export const products = [
    new Product(1, "Produit 1", "Description 1", 10.99, 50),
    new Product(2, "Produit 2", "Description 2", 19.99, 30),
    new Product(3, "Produit 3", "Description 3", 5.99, 100),
    new Product(4, "Produit 4", "Description 4", 100, 10),
];

// Charger les stocks sauvegardés
function loadStocks() {
    const savedStocks = localStorage.getItem('productStocks');
    if (savedStocks) {
        const stocks = JSON.parse(savedStocks);
        products.forEach(product => {
            if (stocks[product.id] !== undefined) {
                product.stock = stocks[product.id];
            }
        });
    }
}

// Sauvegarder les stocks
export function saveStocks() {
    const stocks = {};
    products.forEach(product => {
        stocks[product.id] = product.stock;
    });
    localStorage.setItem('productStocks', JSON.stringify(stocks));
}

// Charger les stocks au démarrage
loadStocks();

export function getFavorites() {
    const user = localStorage.getItem('connectedUser');
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`favorites_${user}`)) || [];
}

export function toggleFavorite(productId) {
    const user = localStorage.getItem('connectedUser');
    if (!user) {
        alert("Vous devez être connecté pour gérer les favoris.");
        return;
    }
    
    let favorites = getFavorites();
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        alert('Produit retiré des favoris !');
    } else {
        favorites.push(productId);
        alert('Produit ajouté aux favoris !');
    }
    
    localStorage.setItem(`favorites_${user}`, JSON.stringify(favorites));
    displayProductList(products);
}

export function displayProductList(products) {
    const productList = document.getElementById('product-list');
    const favorites = getFavorites();
    const user = localStorage.getItem('connectedUser');
    
    productList.innerHTML = '';
    products.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Prix : ${product.price.toFixed(2)} €</p>
            <p>Stock : ${product.stock} disponible(s)</p>
            <div>
                <input type="number" min="1" max="${product.stock}" value="1" class="quantity-input" data-id="${product.id}" style="width:60px;">
                <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                ${user ? `<button class="toggle-favorite" data-id="${product.id}" style="background:${isFavorite ? '#e74c3c' : '#95a5a6'}">
                    ${isFavorite ? '❤️' : '🤍'} Favori
                </button>` : ''}
            </div>
        `;
        productList.appendChild(div);
    });
}