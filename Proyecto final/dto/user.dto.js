class UserDTO {
    constructor({ _id, username, first_name, last_name, age, email, role, lastConnection, cartId }) {
        this.id = _id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.age = age;
        this.email = email;
        this.role = role;
        this.lastConnection = lastConnection;
        this.cartId = cartId;
    }
}

module.exports = UserDTO;