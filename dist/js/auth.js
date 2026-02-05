// js/auth.js

function iniciarLogin() {
    // Comprobamos si la librería ya existe
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "177089609577-bsulfpm58lttoqqje7jo3i5mc0gtqcf5.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("google_btn_container"),
            { theme: "outline", size: "large" }
        );
    } else {
        // Si no existe, esperamos 300ms y reintentamos
        setTimeout(iniciarLogin, 300);
    }
}

function handleCredentialResponse(response) {
    console.log("Token recibido!");
    // Aquí pondremos la lógica para mostrar el nombre del usuario después
}

// Lanzamos la función
iniciarLogin();