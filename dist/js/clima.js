const divSpinner = document.getElementById('spinner');
const contenedorTarjeta = document.getElementById('contenedor');
if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(posicion => {

        const { latitude, longitude } = posicion.coords
        verClima(latitude, longitude);

    }, () => {
        console.log('Permiso aceptado');
        //document.getElementById('spinner').classList.remove('spinner');


    })
} else {
    alert('tu navegador no soporta geolocalizacion');

} async function verClima(latitude, longitude) {
    try {
        const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=74b5f12ddcb7c899e4438acd31700172&units=metric&lang=es`);
        const datos = await respuesta.json();

        const { icon, description } = datos.weather[0];
        const temperatura = datos.main.temp;

        const { temp_min, temp_max } = datos.main;
        const pais = datos.sys.country;
        // desparecer el spinner
        divSpinner.classList.add('d-none');
        //ESTO ES LO QUE FALTABA: Quitar la clase que lo oculta
        contenedorTarjeta.classList.remove('d-none');
        //mostrar la tarjeta
        contenedorTarjeta.classList.add('contenedor');
        //agregar informacion a la tarjeta
        document.getElementById('temperatura').textContent = Math.floor(temperatura) + ' °C';
        document.getElementById('icono').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        document.getElementById('descripcion').textContent = description;
        document.getElementById('temp_min').textContent = 'Min: ' + Math.floor(temp_min) + ' °C';
        document.getElementById('temp_max').textContent = 'Max: ' + Math.floor(temp_max) + ' °C';
        document.getElementById('pais').textContent = pais;


    } catch (error) {
        console.log('Error al tener el clima', error);
    }
}

