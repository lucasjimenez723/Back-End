class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios");
        return;
    }

        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
        console.error("Ya existe un producto con ese código");
        return;
    }

        const id = this.products.length + 1;
        const product = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    };

        this.products.push(product);
        console.log("Producto agregado:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
        return product;
        } else {
        console.error("Producto no encontrado");
        }
    }
    }

  const productManager = new ProductManager();
  
  productManager.addProduct("Iphone 14", "Morado", 900, "imagen1.jpg", "ABC123", 30);
  productManager.addProduct("Iphone 15", "Titanio", 1100, "imagen2.jpg", "ABC456", 10);
  
  const allProducts = productManager.getProducts();
  console.log("Todos los productos:", allProducts);
  
  const productById = productManager.getProductById(1);
  console.log("Producto por ID:", productById);
  
  const nonExistentProduct = productManager.getProductById(3); 
