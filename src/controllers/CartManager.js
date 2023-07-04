import fs from "fs";

export class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.format = "utf-8";
  }

  async getCarts() {
    try {
      const content = await fs.promises.readFile(this.filePath, this.format);
      return JSON.parse(content);
    } catch (error) {
      console.log("Error: Archivo no encontrado");
      return [];
    }
  }

  async getCartsById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((prod) => prod.id === id);
    return cart || null;
  }

  async generateId() {
    const carts = await this.getCarts();
    return carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
  }

  async saveCarts(carts) {
    try {
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(carts, null, 2),
        this.format
      );
    } catch (error) {
      throw new Error("Error al guardar los carritos.");
    }
  }

  async getProducts() {
    try {
      const content = await fs.promises.readFile(
        "./src/assets/products.json",
        this.format
      );
      return JSON.parse(content);
    } catch (error) {
      console.log("Error: Archivo de productos no encontrado");
      return [];
    }
  }

  async addCart() {
    const products = await this.getProducts();
    const cart = {
      id: await this.generateId(),
      products: products.map((product) => ({
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
      })),
    };
    const carts = await this.getCarts();
    carts.push(cart);
    await this.saveCarts(carts);
    return cart;
  }
  

  async addProductsToCart(cartId, productId) {
    let carts = await this.getCarts();
    const cartIndex = carts.findIndex((item) => item.id === cartId);

    if (cartIndex === -1) {
      return null;
    }

    const cart = carts[cartIndex];
    const existingProduct = cart.products.find(
      (item) => item.product === productId
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const products = await this.getProducts();
      const productToAdd = products.find((product) => product.id === productId);
      if (productToAdd) {
        cart.products.push({
          title: productToAdd.title,
          description: productToAdd.description,
          price: productToAdd.price,
          thumbnail: productToAdd.thumbnail,
          quantity: 1,
        });
      }
    }

    carts[cartIndex] = cart;
    await this.saveCarts(carts);

    return cart;
  }
}