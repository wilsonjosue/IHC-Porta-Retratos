// Actualizar la hora y cambiar el ícono de día/noche dinámicamente
document.addEventListener("DOMContentLoaded", async () => {
    const timeElement = document.getElementById("current-time");
    const dayNightIcon = document.getElementById("day-night-icon");
    const currentDateElement = document.getElementById("current-date");
    const mainImage = document.getElementById("main-image");
    const imageContainer = mainImage.parentElement;
    const alertContainer = document.getElementById("alert-container");
     
    // Verificar si los elementos existen
    if (!timeElement || !dayNightIcon || !currentDateElement) {
        console.error("Elementos necesarios no encontrados en el DOM.");
        return;
    }

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

    // Función para verificar alertas
    const checkForAlerts =  async () => {
        try {
            const response = await fetch('/check-activities');
            const result =  await response.json();

            // Limpiar alertas previas
            alertContainer.innerHTML = "";

            if (result.alerts.length > 0) {
                result.alerts.forEach((alert) => {
                    const alertMessage = document.createElement("div");
                    alertMessage.className = "alert";
                    alertMessage.textContent = `¡Alerta! Actividad programada: ${alert.description}`;
                    alertContainer.appendChild(alertMessage);

                    // Opcional: Eliminar alerta después de un tiempo
                    setTimeout(() => {
                        alertMessage.remove();
                    }, 10000); // 10 segundos
                });
            }
        } catch (error) {
            console.error("Error al verificar actividades:", error);
        }
    };

    // Ejecutar la verificación inicialmente
    checkForAlerts();

    // Configurar para ejecutarse cada minuto
    setInterval(checkForAlerts, 60000);
    
    // Actualizar fecha y hora inicialmente
    updateDate();
    updateTimeAndIcon();
    // Actualizar cada segundo
    setInterval(updateTimeAndIcon, 1000);
    // Inicializar página
    await loadConfig();
    
});
