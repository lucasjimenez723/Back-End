const socket = io();

socket.on("connect", () => {
  console.log("Conexión a Socket.IO exitosa");

  socket.on("newProduct", (newProduct) => {
    console.log(newProduct);
  });
});