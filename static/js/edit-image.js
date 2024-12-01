document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-changes-button');
    const backgroundSelector = document.getElementById('background-selector');
    const mainImageSelector = document.getElementById('main-image-selector');

    saveButton.addEventListener('click', () => {
        const background = backgroundSelector.value;
        const mainImage = mainImageSelector.files[0];

        if (mainImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                saveChanges(e.target.result, background);
            };
            reader.readAsDataURL(mainImage);
        } else {
            saveChanges(null, background);
        }
    });

    function saveChanges(mainImage, background) {
        fetch('/save-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ main_image: mainImage, background })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = '/';
        })
        .catch(error => console.error('Error:', error));
    }
    // Añadir stickers a la imagen principal
});