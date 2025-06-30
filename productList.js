export function displayProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <p>${product.name}</p>
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}