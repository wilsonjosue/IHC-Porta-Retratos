from flask import Flask, render_template, request, redirect, url_for
from flask import jsonify
import os
import json

app = Flask(__name__)

STATE_FILE = os.path.join('data', 'state.json')

# Función para cargar el estado
def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"main_image": "/static/images/imagen6.jpg", "background": ""}

# Función para guardar el estado
def save_state(data):
    with open(STATE_FILE, 'w') as f:
        json.dump(data, f)

# Rutas para manejar la edición de imagen:
@app.route('/edit-image', methods=['GET'])
def edit_image():
    state = load_state()
    return render_template('edit_image.html', state=state)

@app.route('/save-image', methods=['POST'])
def save_image():
    data = request.json
    main_image = data.get("main_image")
    background = data.get("background")

    # Actualizar el estado
    state = load_state()
    state["main_image"] = main_image
    state["background"] = background
    save_state(state)

    return jsonify({"message": "Configuración guardada correctamente"})


@app.route('/')
def main_page():
    state = load_state() # Función que devuelve el estado, incluyendo "main_image"
    return render_template('main.html', main_image=state["main_image"],background=state["background"])

if __name__ == '__main__':
    app.run(debug=True)
