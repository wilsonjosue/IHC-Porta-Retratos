document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-container");
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const mainImage = document.getElementById("main-image");

    // Lista de imágenes en la galería
    const galleryImages = [
        "/static/images/imagen2.jpg", // Imagen predeterminada
        "/static/images/imagen3.jpg",
        "/static/images/imagen4.jpg",
    ];

    // Renderiza la galería de imágenes
    const renderGallery = () => {
        galleryContainer.innerHTML = ""; // Limpia la galería
        galleryImages.forEach((imageSrc, index) => {
            const imgElement = document.createElement("img");
            imgElement.src = imageSrc;
            imgElement.alt = `Imagen ${index + 1}`;
            imgElement.className = "gallery-image";
            imgElement.addEventListener("click", () => {
                setMainImage(imageSrc);
            });
            galleryContainer.appendChild(imgElement);
        });
    };

    // Cambia la imagen principal
    const setMainImage = (imageSrc) => {
        mainImage.src = imageSrc;
        alert("La imagen principal ha sido actualizada.");
    };

    // Maneja la carga de nuevas imágenes
    uploadForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                galleryImages.push(e.target.result); // Agrega la nueva imagen a la galería
                renderGallery();
                alert("Imagen cargada con éxito.");
            };
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        } else {
            alert("Por favor, selecciona una imagen para cargar.");
        }
    });

    // Renderiza la galería al cargar la página
    renderGallery();
});
