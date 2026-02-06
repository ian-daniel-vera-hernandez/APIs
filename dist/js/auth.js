let client;
let access_token;

// 1. Función para decodificar el JWT de Google
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function iniciarLogin() {
    if (typeof google !== 'undefined') {
        // Inicializamos el cliente de Token para YouTube
        client = google.accounts.oauth2.initTokenClient({
            client_id: '177089609577-bsulfpm58lttoqqje7jo3i5mc0gtqcf5.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            enable_granular_consent: true, // Esto ayuda a que el usuario elija qué permisos dar
            callback: (tokenResponse) => {
                if (tokenResponse.error !== undefined) {
                    throw tokenResponse;
                }
                access_token = tokenResponse.access_token;
                console.log("Acceso a YouTube concedido");
                cargarDatosYouTube();
            },
        });

        // Renderizamos el botón de perfil
        google.accounts.id.initialize({
            client_id: "177089609577-bsulfpm58lttoqqje7jo3i5mc0gtqcf5.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        
        google.accounts.id.renderButton(
            document.getElementById("google_btn_container"),
            { theme: "outline", size: "large" }
        );
    } else {
        setTimeout(iniciarLogin, 200);
    }
}

function solicitarAccesoYouTube() {
    if (client) {
        client.requestAccessToken();
    }
}

function handleCredentialResponse(response) {
    const payload = decodeJwtResponse(response.credential);
    console.log("Usuario logueado:", payload.name);
    
    // Cambiamos el botón por un botón de "Cargar YouTube"
    document.getElementById("google_btn_container").innerHTML = `
        <button onclick="solicitarAccesoYouTube()" class="btn btn-danger btn-sm">
            <i class="fab fa-youtube"></i> Vincular YouTube
        </button>
        <img src="${payload.picture}" class="rounded-circle ms-2" style="width:35px;">
    `;
    // Quitamos el solicitarAccesoYouTube() automático de aquí para que no lo bloqueen
}

async function cargarDatosYouTube() {
    // mine=true requiere que el token sea válido y tenga el scope de youtube.readonly
    const url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=5`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        const data = await response.json();
        
        if (data.items) {
            mostrarSuscripciones(data.items);
        } else {
            console.log("No se encontraron suscripciones o el canal está privado.");
        }
    } catch (error) {
        console.error("Error al obtener datos de YouTube:", error);
    }
}

function mostrarSuscripciones(channels) {
    const contenedor = document.getElementById("youtube-info");
    contenedor.innerHTML = ''; 

    channels.forEach(item => {
        contenedor.innerHTML += `
            <div class="yt-subscription-item">
                <img src="${item.snippet.thumbnails.default.url}" class="yt-thumb">
                <div class="yt-text-container">
                    <span class="yt-channel-name">${item.snippet.title}</span>
                    <small class="text-muted">YouTube</small>
                </div>
            </div>
        `;
    });
}

// Arrancar proceso
iniciarLogin();