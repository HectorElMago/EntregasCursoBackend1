const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './data/carts.json';

let carts = [];
if (fs.existsSync(path)) {
  carts = JSON.parse(fs.readFileSync(path, 'utf-8'));
}

// Generar nuevo ID
const generateId = () => {
  return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
};

// POST / - Crea un nuevo carrito
router.post('/', (req, res) => {
  const newCart = { id: generateId(), products: [] };
  carts.push(newCart);
  fs.writeFileSync(path, JSON.stringify(carts, null, 2));
  res.status(201).json(newCart);
});

// GET /:cid - Lista los productos de un carrito
router.get('/:cid', (req, res) => {
  const cart = carts.find(c => c.id == req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// POST /:cid/product/:pid - Agrega producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cart = carts.find(c => c.id == req.params.cid);
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  const productIndex = cart.products.findIndex(p => p.product == req.params.pid);
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  fs.writeFileSync(path, JSON.stringify(carts, null, 2));
  res.json(cart);
});

module.exports = router;
