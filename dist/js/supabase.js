// 1. Configuración (Pega aquí tus credenciales)
    const SB_URL = 'https://omcechkxkkemyezvaugh.supabase.co';
    const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2VjaGt4a2tlbXllenZhdWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTg0NjcsImV4cCI6MjA4NTk3NDQ2N30.erjcrFa6_gTmyc77nvGFzFVwjSyXVBZaS8-hCOQt6DI';
    
    // 2. Inicializar cliente
    const _supabase = supabase.createClient(SB_URL, SB_KEY);

    // 3. Función para obtener datos
    async function cargarDatosSupabase() {
        const tablaHTML = document.getElementById('cuerpo-tabla');
        
        try {
            let { data: registros, error } =  await _supabase.from('canciones').select('*');            
            // await _supabase
            //     .from('canciones') 
            //     .select('*');

            if (error) throw error;

            // Limpiamos la tabla
            tablaHTML.innerHTML = '';


            // Recorremos los datos y dibujamos las filas
            registros.forEach(fila => {
                // OJO: fila.id, fila.nombre deben llamarse igual que en tu base de datos
                const row = `
                    <tr>
                        <td>${fila.id}</td>
                        <td>${fila.nombre}</td> 
                        <td>${fila.artista}</td>
                        <td>${fila.album}</td>
                        <td>${fila.climaIdeal}</td>
                    </tr>
                `;
                tablaHTML.innerHTML += row;
            });

        } catch (error) {
            console.error('Error Supabase:', error);
            tablaHTML.innerHTML = `<tr><td colspan="3" class="text-danger">Error: ${error.message}</td></tr>`;
        }
    }

    // 4. Cargar los datos al iniciar la página
    document.addEventListener('DOMContentLoaded', cargarDatosSupabase);