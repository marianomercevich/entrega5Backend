import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/assets/carts.json");

router.get('/', async (req, res) => {
  const limit = req.query.limit;
  let carts = await cartManager.getCarts();

  if (!limit) {
    res.send(carts);
  } else {
    let arrayLimited = [];
    for (let i = 0; i < limit; i++) {
      arrayLimited.push(carts[i]);
    }
    res.send(arrayLimited);
  }
});

// Consulta de carrito por id
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);

    const cart = await cartManager.getCartsById(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id ${cartId} no existe` });
    }

    res.send(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Creación de un nuevo carrito
router.post("/", async (req, res) => {
  try {
    await cartManager.addCart();
    res.json({ message: "Carrito creado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Agregado de productos al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: "Producto no válido" });
    }

    const cart = await cartManager.addProductsToCart(cartId, productId);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id ${cartId} no existe` });
    }

    res.json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;