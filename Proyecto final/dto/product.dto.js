class ProductDTO{
    constructor({title, description, price, thumbnail, code, stock, status, category, owner}){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.status = status
        this.category = category
        this.owner = owner
    }
}

module.exports = ProductDTO;