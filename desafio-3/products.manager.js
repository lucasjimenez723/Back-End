const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productIdCounter = 1;
        this.loadFromFile();
    }

    addProduct(productData) {
        if (!productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        const existingProduct = this.getProductByCode(productData.code);
        if (existingProduct) {
            console.log(`Ya existe un producto con el código '${productData.code}'.`);
            return;
        }

        productData.id = this.productIdCounter++;
        this.saveToFile(productData);
        console.log(`Producto '${productData.title}' agregado correctamente.`);
    }

    getProductByCode(code) {
        const products = this.getAllProducts();
        return products.find(product => product.code === code);
    }

    getAllProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('Error al cargar productos desde archivo:', error.message);
            return [];
        }
    }

    getProductById(id) {
        const products = this.getAllProducts();
        const product = products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
            return null;
        }
    }

    saveToFile(productData) {
        try {
            let products = this.getAllProducts();
            products.push(productData);
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
            console.log('Producto guardado en archivo.');
        } catch (error) {
            console.log('Error al guardar producto en archivo:', error.message);
        }
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            console.log('Productos cargados desde archivo.');
        } catch (error) {
            console.log('Error al cargar productos desde archivo:', error.message);
            this.products = []; 
        }
    }
    

}

const manager = new ProductManager('products.json');

manager.addProduct({
    title: "Remera",
    description: "Remera de algodón oversize de alta calidad",
    price: 5000,
    thumbnail: "remera.jpg",
    code: "RM001",
    stock: 25
});

manager.addProduct({
    title: "Jean",
    description: "Jean clásico con roturas",
    price: 10000,
    thumbnail: "jean.jpg",
    code: "JN001",
    stock: 10
});

manager.addProduct({
    title: "Campera",
    description: "Campera impermeable para todas las estaciones",
    price: 15000,
    thumbnail: "campera.jpg",
    code: "CP001",
    stock: 20
});



console.log(manager.getAllProducts());

console.log(manager.getProductById(2)); 
console.log(manager.getProductById(5));

module.exports = ProductManager;