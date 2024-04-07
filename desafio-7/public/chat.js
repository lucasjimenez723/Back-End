document.addEventListener("DOMContentLoaded", () => {
    const socket = io(); // Conexión con el servidor de Socket.IO

    // Obtener el nombre de usuario (puedes obtenerlo de alguna manera, por ejemplo, desde un formulario de inicio de sesión)
    const userName = obtenerNombreDeUsuario();

    const form = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const messagesDiv = document.getElementById("messages");

    // Escuchar el envío del formulario de mensajes
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message !== "") {
            // Enviar mensaje al servidor con el nombre de usuario y el mensaje
            socket.emit("mensaje", userName, message);
            messageInput.value = ""; // Limpiar el campo de entrada
        }
    });

    // Escuchar mensajes recibidos del servidor y mostrarlos en la vista
    socket.on("nuevoMensaje", (nombre, mensaje) => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `${nombre}: ${mensaje}`;
        messagesDiv.appendChild(messageDiv);
    });
});