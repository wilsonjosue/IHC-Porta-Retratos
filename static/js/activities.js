document.addEventListener("DOMContentLoaded", () => {
    const activities = []; // Almacena las actividades programadas
    const activityForm = document.getElementById("activity-form");
    const activityList = document.getElementById("activity-list");
    const activityDate = document.getElementById("activity-date");
    const activityTime = document.getElementById("activity-time");
    const activityDescription = document.getElementById("activity-description");
    const alertContainer = document.getElementById("alert-container");

    // Función para agregar una nueva actividad
    const addActivity = (date, time, description) => {
        const activity = {
            id: Date.now(),
            date,
            time,
            description,
        };
        activities.push(activity);
        renderActivities();
    };

    // Función para renderizar la lista de actividades
    const renderActivities = () => {
        activityList.innerHTML = ""; // Limpia la lista
        activities.forEach((activity) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${activity.date} ${activity.time} - ${activity.description}`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.addEventListener("click", () => {
                deleteActivity(activity.id);
            });
            listItem.appendChild(deleteButton);
            activityList.appendChild(listItem);
        });
    };

    // Función para eliminar una actividad
    const deleteActivity = (id) => {
        const index = activities.findIndex((activity) => activity.id === id);
        if (index !== -1) {
            activities.splice(index, 1);
            renderActivities();
        }
    };

    // Función para mostrar una alerta en la pantalla principal
    const showAlert = (activity) => {
        const alert = document.createElement("div");
        alert.className = "activity-alert";
        alert.textContent = `¡Recordatorio! ${activity.description}`;
        const closeButton = document.createElement("button");
        closeButton.textContent = "Cerrar";
        closeButton.addEventListener("click", () => {
            alert.remove();
        });
        alert.appendChild(closeButton);
        alertContainer.appendChild(alert);
    };

    // Chequea las actividades programadas
    const checkActivities = () => {
        const now = new Date();
        activities.forEach((activity) => {
            const [year, month, day] = activity.date.split("-");
            const [hour, minute] = activity.time.split(":");
            const activityTime = new Date(year, month - 1, day, hour, minute);
            if (
                activityTime <= now &&
                activityTime > new Date(now.getTime() - 60000) // Evitar alertas repetidas
            ) {
                showAlert(activity);
            }
        });
    };

    // Configurar el envío del formulario de actividades
    activityForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const date = activityDate.value;
        const time = activityTime.value;
        const description = activityDescription.value;
        if (date && time && description) {
            addActivity(date, time, description);
            activityForm.reset();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });

    // Comprobar las actividades cada minuto
    setInterval(checkActivities, 60000);
});
