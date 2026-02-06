async function fetchAsteroids() {
    const apiKey = 'Pv4VrRhxHm6mm5NEIh3gUGk5oXZt35lmQnp5qTdm'; 
    const hoy = new Date().toISOString().split('T')[0]; 
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoy}&end_date=${hoy}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Obtenemos todos los asteroides de hoy
        const allAsteroids = data.near_earth_objects[hoy];

        // Usamos .slice(0, x) para tomar solo los primeros elementos del arreglo
        const limitedAsteroids = allAsteroids.slice(0, 8);

        const tableBody = document.getElementById('asteroids-body');
        tableBody.innerHTML = ''; 

        limitedAsteroids.forEach(neo => {
            const row = `
                <tr>
                    <td><strong>${neo.name}</strong></td>
                    <td>${neo.is_potentially_hazardous_asteroid ? 
                        '<span class="badge bg-danger">Sí</span>' : 
                        '<span class="badge bg-success">No</span>'}</td>
                    <td>${Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} m</td>
                    <td>${Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_hour)} km/h</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al traer datos de la NASA:", error);
        document.getElementById('asteroids-body').innerHTML = '<tr><td colspan="4">Error al cargar datos.</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAsteroids);