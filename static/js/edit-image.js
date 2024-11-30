document.addEventListener("DOMContentLoaded", () => {
    const mainImage = document.getElementById("main-image");
    const backgroundSelector = document.getElementById("background-selector");
    const frameSelector = document.getElementById("frame-selector");
    const stickerContainer = document.getElementById("sticker-container");
    const stickerOptions = document.querySelectorAll(".sticker-option");
    const resetButton = document.getElementById("reset-button");

    // Cambiar el fondo de la imagen principal
    backgroundSelector.addEventListener("change", (event) => {
        const selectedBackground = event.target.value;
        const imageContainer = mainImage.parentElement;
        imageContainer.style.backgroundImage = `url('/static/images/backgrounds/${selectedBackground}.jpg')`;
    });

    // Añadir un marco alrededor de la imagen principal
    frameSelector.addEventListener("change", (event) => {
        const selectedFrame = event.target.value;
        mainImage.style.borderImageSource = `url('/static/images/frames/${selectedFrame}.png')`;
        mainImage.style.borderImageSlice = "30"; // Ajusta el marco a la imagen
        mainImage.style.borderWidth = "15px";
        mainImage.style.borderStyle = "solid";
    });

    // Añadir stickers a la imagen principal
    stickerOptions.forEach((sticker) => {
        sticker.addEventListener("click", () => {
            const stickerImage = document.createElement("img");
            stickerImage.src = `/static/images/stickers/${sticker.dataset.sticker}`;
            stickerImage.classList.add("sticker");
            stickerImage.style.position = "absolute";
            stickerImage.style.left = "50%";
            stickerImage.style.top = "50%";
            stickerImage.style.transform = "translate(-50%, -50%)";
            stickerImage.draggable = true;

            // Hacer el sticker arrastrable
            stickerImage.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", null);
                stickerImage.classList.add("dragging");
            });

            stickerImage.addEventListener("dragend", () => {
                stickerImage.classList.remove("dragging");
            });

            stickerContainer.appendChild(stickerImage);
        });
    });

    // Restablecer todas las ediciones
    resetButton.addEventListener("click", () => {
        mainImage.style.borderImageSource = "";
        mainImage.style.borderWidth = "";
        mainImage.style.borderStyle = "";
        const imageContainer = mainImage.parentElement;
        imageContainer.style.backgroundImage = "";
        stickerContainer.innerHTML = ""; // Eliminar todos los stickers
    });
});
