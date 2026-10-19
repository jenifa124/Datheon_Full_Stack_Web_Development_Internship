# E-Commerce Product Catalog & Interactive Shopping Cart

**Task 4** – Manage complex component state, quantity math, and slide-out checkout drawers.

## Overview

A modern e-commerce storefront that fetches product data from [FakeStoreAPI](https://fakestoreapi.com/products), renders product cards with ratings, prices, and category badges, supports category filtering (Electronics, Jewelry, Clothing) and search, and provides a persistent slide-out shopping cart with quantity controls, tax/shipping computation, and a simulated checkout modal.

## Features

- **Product Catalog** – Fetches live data from FakeStoreAPI (`https://fakestoreapi.com/products`)
- **Product Cards** – Image, title, price, star rating + review count, category badge
- **Category Filters** – All / Electronics / Jewelry / Clothing
- **Search** – Filter products by title or description
- **Slide-out Cart Drawer** – Opens from navbar cart icon with live badge counter
- **Cart Actions**
  - `addToCart()`
  - `removeFromCart()`
  - `updateQuantity()` (increment / decrement)
  - `calculateTotal()`
- **Pricing**
  - Subtotal
  - Tax (8%)
  - Shipping ($5.99 flat, free over $50)
  - Grand total
- **Persistent Cart** – Saved in `localStorage`
- **Checkout Modal** – Simulated order confirmation with order ID
- **Responsive Grid** – CSS Grid product layout

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (Grid, custom properties, transitions)
- FakeStoreAPI
- localStorage for cart persistence

## Project Structure

```
ecommerce-store/
├── index.html      # Markup (navbar, filters, product grid, cart drawer, modal)
├── styles.css      # Layout, components, responsive styles
├── script.js       # Fetch, state, cart logic, rendering
└── README.md       # This file
```

## How to Run

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
2. Or serve the folder with any static server:

```bash
npx serve .
# or
python -m http.server 3000
```

No build step or dependencies required. Internet connection is needed to load products from FakeStoreAPI.

## Suggested Technical Approach (as implemented)

1. Fetch product catalog from FakeStoreAPI.
2. Implement product search and category filter buttons.
3. Create a cart slide-out drawer with badge counter on the navbar.
4. Implement cart actions: `addToCart()`, `removeFromCart()`, `updateQuantity()`, and `calculateTotal()`.
5. Add a simulated checkout modal with order confirmation.

## Expected Deliverable

Functional e-commerce store with category filtering, cart calculations, and responsive product grids.
