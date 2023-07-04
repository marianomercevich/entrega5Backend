import { Router } from 'express';
import { ProductManager } from '../controllers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/assets/products.json');

router.get('/', async (req, res) => {
  const limit = req.query.limit;
  let products = await productManager.getProducts();

  if (!limit) {
    res.send(products);
  } else {
    let arrayLimited = [];
    for (let i = 0; i < limit; i++) {
      arrayLimited.push(products[i]);
    }
    res.send(arrayLimited);
  }
});

// Endpoint para obtener un solo producto por su ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const products = await productManager.getProducts();
  const product = products.find(el => el.id == id);

  if (!product) {
    return res.status(404).json({ message: 'Este producto no existe' });
  }

  res.send(product);
});

router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnail } = req.body;

  if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
    return res.status(400).json({ message: 'Faltan propiedades en el cuerpo de la solicitud' });
  }

  await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);

 
  res.json({ message: 'Producto registrado con éxito!' });
  await productManager.saveProducts(products);
  io.emit('addProduct', products);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  await productManager.updateProduct(id, data);

  let products = await productManager.getProducts();
  const productIndex = products.findIndex(item => item.id == id);
  products[productIndex] = { ...products[productIndex], ...data };

  await productManager.saveProducts(products);
  io.emit('updateProducts', products);
  res.json({ message: `Actualización exitosa del producto con id = ${id}` });
});


router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await productManager.deleteProduct(id);

  let products = await productManager.getProducts();
  products = products.filter(item => item.id != id);

  res.json({ message: `Producto con id = ${id} eliminado` });
  await productManager.saveProducts(products);
  io.emit('deleteProducts', products);
  
});

export default router;