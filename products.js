export const products = [
    { id: 1, name: "Produit 1", description: "Description 1", price: 10.99 },
    { id: 2, name: "Produit 2", description: "Description 2", price: 19.99 },
    { id: 3, name: "Produit 3", description: "Description 3", price: 5.99 },
    { id: 4, name: "Produit 4", description: "Description 4", price: 100 },
];

export function displayProductList(products) {
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