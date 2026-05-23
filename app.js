// Sanné Main JS

// 1. Navigation & Mobile Menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// 2. Product Data for Search & Cart
const products = [
  {
    id: 'p1',
    name: 'Moisturizing Cream',
    variant: 'For Dry Skin',
    price: 249,
    image: 'images/dry_skin.jpg',
    keywords: ['dry skin', 'moisturizer', 'moisturizing cream', 'cream', 'hydration', 'jojoba oil', 'sweet almond oil', 'ceramide NP', 'hyaluronic acid']
  },
  {
    id: 'p2',
    name: 'Moisturizing Cream',
    variant: 'For Oily and Combination Skin',
    price: 249,
    image: 'images/oily_skin.jpg',
    keywords: ['oily skin', 'combination skin', 'moisturizer', 'moisturizing cream', 'lightweight', 'non greasy', 'barrier comfort', 'soothing extracts']
  },
  {
    id: 'p3',
    name: 'Bosbos Body Fragrance',
    variant: 'Makhmarya',
    price: 89,
    image: 'images/bosbos.jpg',
    keywords: ['bosbos', 'body fragrance', 'makhmarya', 'scent', 'scented skin gel', 'perfume', 'body care']
  }
];

// 3. Search Logic
const searchNav = document.getElementById('nav-search');
const mobileSearch = document.getElementById('mobile-search');
const searchOverlay = document.getElementById('search-overlay');
const closeSearch = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

function openSearch(e) {
  e.preventDefault();
  searchOverlay.classList.add('active');
  if (mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
  setTimeout(() => searchInput.focus(), 100);
}

function closeSearchOverlay() {
  searchOverlay.classList.remove('active');
  searchInput.value = '';
  searchResults.innerHTML = '';
}

if (searchNav) searchNav.addEventListener('click', openSearch);
if (mobileSearch) mobileSearch.addEventListener('click', openSearch);
if (closeSearch) closeSearch.addEventListener('click', closeSearchOverlay);

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      searchResults.innerHTML = '';
      return;
    }
    
    const matches = products.filter(p => {
      return p.name.toLowerCase().includes(term) || 
             p.variant.toLowerCase().includes(term) || 
             p.keywords.some(k => k.includes(term));
    });
    
    if (matches.length === 0) {
      searchResults.innerHTML = '<p class="text-center" style="color: var(--color-text-light);">No products found.</p>';
    } else {
      searchResults.innerHTML = matches.map(p => `
        <div class="search-result-item" style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; cursor: pointer;" onclick="window.location.href='shop.html'">
          <img src="${p.image}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-dark-brown); margin: 0;">${p.name}</h4>
            <p style="font-size: 0.85rem; color: var(--color-text-light); margin: 0;">${p.variant}</p>
            <p style="font-size: 0.9rem; font-weight: 500; color: var(--color-dark-brown); margin: 0;">${p.price} EGP</p>
          </div>
        </div>
      `).join('');
    }
  });
}

// 4. Cart Logic
let cart = JSON.parse(localStorage.getItem('sanne_cart')) || [];
const cartNav = document.getElementById('nav-cart');
const mobileCart = document.getElementById('mobile-cart');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartBadge = document.getElementById('cart-count-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');
const addBtns = document.querySelectorAll('.add-to-cart-btn');

function saveCart() {
  localStorage.setItem('sanne_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productData, qty = 1) {
  const existing = cart.find(item => item.id === productData.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...productData, qty: qty });
  }
  saveCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) removeFromCart(id);
    else saveCart();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) cartBadge.textContent = `(${totalItems})`;
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg text-center mt-md" style="color: var(--color-text-light);">Your cart is empty.</p>';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
      total += item.price * item.qty;
      return `
        <div class="cart-item" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
          <div style="flex: 1;">
            <h4 style="font-family: var(--font-serif); font-size: 1.1rem; margin: 0; color: var(--color-dark-brown);">${item.name}</h4>
            <p style="font-size: 0.85rem; color: var(--color-text-light); margin: 0 0 0.5rem 0;">${item.variant}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 500;">${item.price} EGP</span>
              <div style="display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: 4px;">
                <button onclick="updateQty('${item.id}', -1)" style="background: none; border: none; padding: 0.2rem 0.6rem; cursor: pointer;">-</button>
                <span style="font-size: 0.9rem; padding: 0 0.5rem;">${item.qty}</span>
                <button onclick="updateQty('${item.id}', 1)" style="background: none; border: none; padding: 0.2rem 0.6rem; cursor: pointer;">+</button>
              </div>
            </div>
          </div>
          <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: var(--color-text-light); font-size: 1.2rem; cursor: pointer;">&times;</button>
        </div>
      `;
    }).join('');
    
    if (cartFooter) cartFooter.style.display = 'block';
    if (cartTotalPrice) cartTotalPrice.textContent = `${total} EGP`;
  }
}

function openCart(e) {
  if(e) e.preventDefault();
  cartOverlay.classList.add('active');
  if (mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
}

function closeCartOverlay() {
  cartOverlay.classList.remove('active');
}

if (cartNav) cartNav.addEventListener('click', openCart);
if (mobileCart) mobileCart.addEventListener('click', openCart);
if (closeCart) closeCart.addEventListener('click', closeCartOverlay);

addBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
      const id = card.getAttribute('data-id');
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    }
  });
});

updateCartUI(); // Init cart UI

// 5. Checkout Logic
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    // Only run this handler if the drawer checkout fields are present
    const nameEl = document.getElementById('checkout-name');
    if (!nameEl) return;

    e.preventDefault();
    
    if (cart.length === 0) return;
    
    const name = nameEl.value;
    const phone = document.getElementById('checkout-phone').value;
    const whatsapp = document.getElementById('checkout-whatsapp').value || phone;
    const city = document.getElementById('checkout-city').value;
    const address = document.getElementById('checkout-address').value;
    const notes = document.getElementById('checkout-notes').value;
    
    let orderLines = '';
    let total = 0;
    cart.forEach(item => {
      orderLines += `- ${item.name} (${item.variant}) x ${item.qty} = ${item.price * item.qty} EGP\n`;
      total += item.price * item.qty;
    });
    
    const messageBody = `Hello Sanné 🌿 I'd like to place an order.
    
*Order Details:*
${orderLines}
*Total:* ${total} EGP
*Payment Method:* Cash on Delivery

*Customer Details:*
Name: ${name}
Phone: ${phone}
WhatsApp: ${whatsapp}
City: ${city}
Address: ${address}
${notes ? `Notes: ${notes}` : ''}`;

    const encodedMsg = encodeURIComponent(messageBody);
    const whatsappUrl = `https://wa.me/201032138278?text=${encodedMsg}`;
    
    // Show success message
    document.getElementById('checkout-success-msg').style.display = 'block';
    checkoutForm.reset();
    cart = [];
    saveCart();
    
    // Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
  });
}

// Make functions global for inline onclick handlers
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;

// 6. Values Hover Logic (About Page)
const valueItems = document.querySelectorAll('.value-item');
const valueImgs = document.querySelectorAll('.value-img');

if (valueItems.length > 0) {
  valueItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const targetId = item.getAttribute('data-target');
      
      valueItems.forEach(v => v.classList.remove('active'));
      valueImgs.forEach(img => img.classList.remove('active'));
      
      item.classList.add('active');
      const targetImg = document.getElementById(targetId);
      if (targetImg) targetImg.classList.add('active');
    });
  });
}
