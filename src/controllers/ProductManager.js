import fs from "fs";

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.format = "utf-8";
  }

  addProduct = async (
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) => {
    let products = await this.getProducts();
    const lastProductId =
      products.length > 0 ? products[products.length - 1].id : 0;
    const newProduct = {
      id: lastProductId + 1,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };
    products.push(newProduct);
    await this.saveProducts(products);
  };

  getProducts = async () => {
    const fileContent = await fs.promises.readFile(this.filePath, this.format);
    return JSON.parse(fileContent);
  };

  getProductById = async (id) => {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  };

  updateProduct = async (id, updatedProduct) => {
    let products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedProduct };
      await this.saveProducts(products);
    }
  };

  deleteProduct = async (id) => {
    let products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await this.saveProducts(products);
    }
  };

  saveProducts = async (products) => {
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(products, null, "\t"),
      this.format
    );
  };
}