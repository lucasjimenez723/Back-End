import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let currentId = 0;

export function generateUniqueId() {
  currentId += 1;
  return currentId;
}

export default __dirname;

export const productsPath = join(__dirname, "data", "products.json");
export const cartsPath = join(__dirname, "data", "carts.json");