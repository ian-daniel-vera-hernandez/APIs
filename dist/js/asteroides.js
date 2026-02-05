
    async function fetchAsteroids() {
        const apiKey = 'Pv4VrRhxHm6mm5NEIh3gUGk5oXZt35lmQnp5qTdm'; // Reemplaza con tu clave
        const hoy = new Date().toISOString().split('T')[0]; // Obtiene fecha actual AAAA-MM-DD
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoy}&end_date=${hoy}&api_key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            // Accedemos a los asteroides de la fecha de hoy
            const asteroids = data.near_earth_objects[hoy];
            const tableBody = document.getElementById('asteroids-body');
            tableBody.innerHTML = ''; // Limpiar mensaje de carga

            asteroids.forEach(neo => {
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

    // Llamar a la función al cargar la página
    document.addEventListener('DOMContentLoaded', fetchAsteroids);
