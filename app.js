import { renderLoginForm, renderRegisterForm } from './inscription.js';
import { displayProductList } from './productList.js';

const root = document.body;

// Example products
const products = [
    { id: 1, name: "Product 1", description: "Description 1", price: 10.99 },
    { id: 2, name: "Product 2", description: "Description 2", price: 19.99 },
    { id: 3, name: "Product 3", description: "Description 3", price: 5.99 }
];

showHome();

function showHome() {
    root.innerHTML = `
        <header>
            <h1>Welcome to our E-Commerce Site</h1>
            <div id="product-list"></div>
            <button id="loginRegisterBtn">Login / Register</button>
        </header>
    `;
    displayProductList(products);
    document.getElementById('loginRegisterBtn').onclick = function() {
        showLogin();
    };
}

function showLogin() {
    root.innerHTML = renderLoginForm();
    addLoginEvents();
}

function showRegister() {
    root.innerHTML = renderRegisterForm();
    addRegisterEvents();
}

function addLoginEvents() {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            alert('Login successful!');
            showHome();
        } else {
            alert('Invalid credentials!');
        }
    };
    document.getElementById('showRegister').onclick = function(e) {
        e.preventDefault();
        showRegister();
    };
}

function addRegisterEvents() {
    document.getElementById('registerForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (localStorage.getItem(username)) {
            alert('User already exists!');
        } else {
            localStorage.setItem(username, JSON.stringify({ username, password }));
            alert('Registration successful!');
            showLogin();
        }
    };
    document.getElementById('showLogin').onclick = function(e) {
        e.preventDefault();
        showLogin();
    };
}