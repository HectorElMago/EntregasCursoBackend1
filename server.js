const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const productsPath = "./data/products.json";

let products = [];
if (fs.existsSync(productsPath)) {
  products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
}

// Crear la app y el servidor HTTP
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Handlebars
const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para JSON
app.use(express.json());

// Middleware para añadir `io` a las solicitudes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas para productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas para vistas
app.get("/", (req, res) => {
  res.render("home", { products: products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { products: products });
});

// Websockets
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Emitir productos actualizados a todos los clientes
  socket.emit("productList", products);

  // Escuchar cuando se agregue o elimine un producto
  socket.on("newProduct", (product) => {
    products.push(product);
    io.emit("productList", products);
  });

  socket.on("deleteProduct", (id) => {
    products = products.filter((p) => p.id !== id);
    io.emit("productList", products);
  });
});

// Iniciar el servidor
httpServer.listen(8080, () => {
  console.log("Server running on port 8080");
});
