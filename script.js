const inventory = [
    { id: 1, name: "Ceylon Cinnamon Sticks", price: 450, img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400" },
    { id: 2, name: "Extra Hot Chili Powder", price: 320, img: "https://images.unsplash.com/photo-1768729340132-a8c72080bb23?w=600" },
    { id: 3, name: "Roasted Curry Powder", price: 280, img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400" },
    { id: 4, name: "Organic Black Pepper", price: 550, img: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400" }
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('product-grid');
    inventory.forEach(item => {
        grid.innerHTML += `
            <div class="card">
                <img src="${item.img}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p class="price">Rs. ${item.price}</p>
                    <button class="add-btn" onclick="addToCart(${item.id})">Add to Basket</button>
                </div>
            </div>`;
    });
}

function toggleCart() {
    const modal = document.getElementById('cart-popup');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

function toggleContact() {
    const modal = document.getElementById('contact-popup');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const product = inventory.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }
    updateUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateUI();
}

function clearCart() {
    if(cart.length === 0) return;
    if(confirm("Empty your basket?")) {
        cart = [];
        updateUI();
    }
}

function updateUI() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const badge = document.getElementById('cart-badge');
    
    badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Your basket is empty</p>';
        totalPrice.innerText = '0';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += (item.price * item.qty);
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <b>${item.qty}</b>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <span>Rs. ${item.price * item.qty}</span>
            </div>`;
    });
    totalPrice.innerText = total;
}

function checkout() {
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const phone = "94741932762"; // PUT YOUR REAL NUMBER HERE (Numbers only)

    if (!name || !address || cart.length === 0) {
        alert("Please fill details and add items!"); return;
    }

    let bill = `📦 *NEW ORDER - LK TASTE*%0A━━━━━━━━━━━━━━━━━━%0A`;
    bill += `👤 *Customer:* ${name}%0A📍 *Address:* ${address}%0A━━━━━━━━━━━━━━━━━━%0A🛍️ *Items Ordered:*%0A`;
    cart.forEach(item => bill += `• ${item.name} x ${item.qty} = Rs.${item.price * item.qty}%0A`);
    bill += `━━━━━━━━━━━━━━━━━━%0A💰 *TOTAL: Rs. ${document.getElementById('total-price').innerText}*%0A━━━━━━━━━━━━━━━━━━`;

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${bill}`, '_blank');
}

renderProducts();
