// Asegúrate de envolver todo en este evento
document.addEventListener('DOMContentLoaded', () => {
    cargarAnimes();
});

async function cargarAnimes() {
    const url = 'https://api.jikan.moe/v4/top/anime?limit=10';

    try {
        const response = await fetch(url);
        
        // Verificamos si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const resJson = await response.json();
        const animes = resJson.data; // IMPORTANTE: Jikan v4 usa la propiedad .data

        const tbody = document.getElementById('cuerpo-tabla-anime');
        if (!tbody) return;
        
        tbody.innerHTML = ''; 

        animes.forEach(anime => {
            // Extraemos los datos con cuidado
            const portada = anime.images.jpg.image_url;
            const titulo = anime.title;
            const estudio = anime.studios.length > 0 ? anime.studios[0].name : 'Desconocido';
            const estado = anime.status === "Currently Airing" ? "En Emisión" : "Finalizado";
            const puntuacion = anime.score || 'N/A';

            tbody.innerHTML += `
                <tr>
                    <td><img src="${portada}" class="anime-thumb" style="width:50px; border-radius:4px;"></td>
                    <td><div class="fw-bold">${titulo}</div></td>
                    <td>${estudio}</td>
                    <td><span class="badge ${anime.status === "Currently Airing" ? 'bg-success' : 'bg-secondary'}">${estado}</span></td>
                    <td>⭐ ${puntuacion}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error detallado:", error);
        document.getElementById('cuerpo-tabla-anime').innerHTML = '<tr><td colspan="5" class="text-center">Error al cargar datos. Revisa la consola.</td></tr>';
    }
}