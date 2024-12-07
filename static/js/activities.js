// Agregamos la funcionalidad para enviar datos al backend y manejar las acciones en la lista.
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("activity-form");
    const activityList = document.getElementById("activity-list");

    // Agregar una nueva actividad
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const date = document.getElementById("activity-date").value;
        const time = document.getElementById("activity-time").value;
        const description = document.getElementById("activity-description").value;

        const response = await fetch("/add-activity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, time, description }),
        });

        const result = await response.json();
        alert(result.message);
        location.reload(); // Recargar para actualizar la lista
    });

    // Eliminar una actividad
    activityList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const activityId = event.target.getAttribute("data-id");
            const response = await fetch(`/delete-activity/${activityId}`, {
                method: "DELETE",
            });

            const result = await response.json();
            alert(result.message);
            location.reload(); // Recargar para actualizar la lista
        }
    });
    
}); 
    

