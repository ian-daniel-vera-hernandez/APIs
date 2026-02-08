async function fetchAsteroids() {
    const apiKey = 'Pv4VrRhxHm6mm5NEIh3gUGk5oXZt35lmQnp5qTdm'; 
    
    // 1. Obtener FECHA LOCAL exacta (evita el salto de día del ISOString)
    const ahora = new Date();
    const fechaLocal = ahora.getFullYear() + '-' + 
                       String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(ahora.getDate()).padStart(2, '0');

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${fechaLocal}&end_date=${fechaLocal}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        let allAsteroids = data.near_earth_objects[fechaLocal] || [];

        // 2. ORDENAR POR HORA (Cercanía al momento actual)
        // Comparamos el epoch (milisegundos) con el momento actual
        const momentoActual = ahora.getTime();

        allAsteroids.sort((a, b) => {
            const tiempoA = a.close_approach_data[0].epoch_date_close_approach;
            const tiempoB = b.close_approach_data[0].epoch_date_close_approach;
            
            // Esto pone los que ocurren más temprano en el día primero
            // O puedes usar Math.abs(tiempoA - momentoActual) para ver los más próximos al "ahora"
            return tiempoA - tiempoB; 
        });

        const limitedAsteroids = allAsteroids.slice(0, 8);
        const tableBody = document.getElementById('asteroids-body');
        tableBody.innerHTML = ''; 

        limitedAsteroids.forEach(neo => {
            // Extraer la hora exacta de aproximación
            const horaCercana = neo.close_approach_data[0].close_approach_date_full.split(' ')[1];

            const row = `
                <tr>
                    <td>
                        <strong>${neo.name}</strong><br>
                        <small class="text-muted"><i class="far fa-clock"></i> ${horaCercana}</small>
                    </td>
                    <td class="text-center">${neo.is_potentially_hazardous_asteroid ? 
                        '<span class="badge bg-danger">Sí</span>' : 
                        '<span class="badge bg-success">No</span>'}</td>
                    <td>${Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} m</td>
                    <td>${Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('asteroids-body').innerHTML = '<tr><td colspan="4">Error al cargar datos.</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAsteroids);