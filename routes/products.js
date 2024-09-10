const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './data/products.json';

let products = [];
if (fs.existsSync(path)) {
  products = JSON.parse(fs.readFileSync(path, 'utf-8'));
}

// Generar nuevo ID
const generateId = () => {
  return products.length > 0 ? products[products.length - 1].id + 1 : 1;
};

// GET / - Lista todos los productos
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit);
  const result = limit ? products.slice(0, limit) : products;
  res.json(result);
});

// GET /:pid - Obtiene un producto por ID
router.get('/:pid', (req, res) => {
  const product = products.find(p => p.id == req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// POST / - Agrega un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios excepto thumbnails' });
  }
  const newProduct = {
    id: generateId(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };
  products.push(newProduct);
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// PUT /:pid - Actualiza un producto por ID
router.put('/:pid', (req, res) => {
  const productIndex = products.findIndex(p => p.id == req.params.pid);
  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
    products[productIndex] = updatedProduct;
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// DELETE /:pid - Elimina un producto por ID
router.delete('/:pid', (req, res) => {
  const productIndex = products.findIndex(p => p.id == req.params.pid);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router;
