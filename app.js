import { renderLoginForm, renderRegisterForm } from './inscripton.js';

const root = document.body;

// Show login form by default
root.innerHTML = renderLoginForm();
addLoginEvents();

function addLoginEvents() {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            alert('Login successful!');
        } else {
            alert('Invalid credentials!');
        }
    };
    document.getElementById('showRegister').onclick = function(e) {
        e.preventDefault();
        root.innerHTML = renderRegisterForm();
        addRegisterEvents();
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
            root.innerHTML = renderLoginForm();
            addLoginEvents();
        }
    };
    document.getElementById('showLogin').onclick = function(e) {
        e.preventDefault();
        root.innerHTML = renderLoginForm();
        addLoginEvents();
    };
}