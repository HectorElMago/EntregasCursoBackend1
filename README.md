# COMO UTILIZAR LAS API'S CON EJEMPLOS

## **Productos:**

### **GET** `/api/products`

Devuelve la primera página de productos (10 productos por defecto).

#### **Query Params disponibles:**

- `limit` => Cantidad de productos que devuelve.  
  **Ejemplo**: `/api/products?limit=5`  
  Devuelve 5 productos.
- `page` => Página de los productos.  
  **Ejemplo**: `/api/products?page=2`  
  Devuelve la segunda página de productos.

- `sort` => Ordenar por precio (`asc` o `desc`).  
  **Ejemplo**: `/api/products?sort=asc`  
  Ordena los productos por precio de menor a mayor.

- `query` => Filtrar por categoría.  
  **Ejemplo**: `/api/products?query=Electrónica`  
  Devuelve productos de la categoría "Electrónica".

- `query` => Filtrar productos activos (`true`) o inactivos (`false`).  
  **Ejemplo**: `/api/products?query=true`  
  Devuelve productos que están activos.

---

## **Carritos:**

### **DELETE** `/api/carts/:cid/products/:pid`

Eliminar un producto específico del carrito.

- **`cid`**: El ID del carrito (ObjectId de MongoDB).
- **`pid`**: El ID del producto (ObjectId de MongoDB).

**Ejemplo**:  
`DELETE http://localhost:8080/api/carts/60f528c54cd11116d1dd517/products/60f528c54cd11116d1dd518`

---

### **PUT** `/api/carts/:cid`

Actualiza el carrito con los productos y las cantidades indicadas en el body.

#### **Ejemplo de body**:

```json
{
  "products": [
    { "product": "670f528c54cd11116d1dd517", "quantity": 2 },
    { "product": "670f528c54cd11116d1dd518", "quantity": 3 }
  ]
}
```

---

### **PUT** `/api/carts/:cid/products/:pid`

Actualizar la cantidad de un producto en el carrito.

#### **Ejemplo de body**:

```json
{
  "quantity": 5
}
```

---

### **DELETE** `/api/carts/:cid`

Limpia el carrito (elimina todos los productos del carrito).

**Ejemplo**:  
`DELETE http://localhost:8080/api/carts/60f528c54cd11116d1dd517`

---
