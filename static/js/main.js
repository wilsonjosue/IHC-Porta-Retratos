// Actualizar la hora y cambiar el ícono de día/noche dinámicamente
document.addEventListener("DOMContentLoaded", async () => {
    const timeElement = document.getElementById("current-time");
    const dayNightIcon = document.getElementById("day-night-icon");
    const currentDateElement = document.getElementById("current-date");
    const mainImage = document.getElementById("main-image");
    const imageContainer = mainImage.parentElement;

    // Cargar configuración guardada
    const loadConfig = async () => {
        const response = await fetch("/get-config");
        const config = await response.json();

        mainImage.src = config.main_image;
        imageContainer.style.backgroundImage = config.background
            ? `url('${config.background}')`
            : "none";
    };

    // Actualizar la fecha actual
    const updateDate = () => {
        const now = new Date();
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        currentDateElement.textContent = now.toLocaleDateString("es-ES", options);
    };

    // Actualizar la hora actual y el ícono de día/noche
    const updateTimeAndIcon = () => {
        const now = new Date();

        // Formatear la hora
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        // Asegurarse de que siempre tenga 2 dígitos
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Actualizar el elemento de hora
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // Cambiar el ícono de día o noche
        const isDay = hours >= 6 && hours < 18; // Día entre las 6:00 y las 18:00
        dayNightIcon.src = isDay
            ? "/static/images/sol.png" // Ícono de sol
            : "/static/images/luna.png"; // Ícono de luna
        dayNightIcon.alt = isDay ? "Día" : "Noche";
    };

    // Inicializar página
    await loadConfig();
    // Actualizar fecha y hora inicialmente
    updateDate();
    updateTimeAndIcon();
    // Actualizar cada segundo
    setInterval(updateTimeAndIcon, 1000);
});
