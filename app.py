from flask import Flask, render_template, request, redirect, url_for
from flask import jsonify
import os
import json
import requests #para la API de noticias
from datetime import datetime #para las actividades

app = Flask(__name__) 

#--------------------------------------------------------
STATE_FILE = os.path.join('data', 'state.json')

# Función para cargar el estado
def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"main_image": "/static/images/imagen6.jpg", "background": "/static/images/backgrounds/fnd1.jpg"}

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

#--------------------------------------------------------
#para la API de noticias :https://newsapi.org/

API_KEY = 'bd44f49d78ae4e709a71bb3254ca9bea'
WSJ_URL = 'https://newsapi.org/v2/everything?domains=wsj.com&apiKey=bd44f49d78ae4e709a71bb3254ca9bea'

@app.route('/news', methods=['GET'])
def show_news():
    # Configurar los parámetros para obtener artículos del WSJ
    params = {
        'domains': 'wsj.com',
        'apiKey': API_KEY,
    }

    # Realizar la solicitud a la API
    response = requests.get(WSJ_URL, params=params)
    
    if response.status_code == 200:
        news_data = response.json()  # Convertir la respuesta en JSON
        articles = news_data.get('articles', [])  # Obtener los artículos
    else:
        articles = []  # Manejo de errores: lista vacía si hay problemas
    
    # Renderizar la plantilla con los artículos
    return render_template('news.html', articles=articles)
#--------------------------------------------------------
# Actividades
ACTIVITIES_FILE = os.path.join('data', 'activities.json')

# -------------------------------------------------------
# Rutas principales
@app.route('/')
def main_page():
    state = load_state() # Función que devuelve el estado, incluyendo "main_image"
    # Enviamos las actividades como JSON
    return render_template('main.html', 
                           main_image=state["main_image"],
                           background=state["background"],)
# -------------------------------------------------------

if __name__ == '__main__':
    app.run(debug=True)
